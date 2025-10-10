// kem_demo.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <oqs/oqs.h>

static double timespec_to_ms(const struct timespec *start, const struct timespec *end) {
    double s = (double)(end->tv_sec - start->tv_sec);
    double ns = (double)(end->tv_nsec - start->tv_nsec);
    return s * 1000.0 + ns / 1e6;
}

static void print_hex(const uint8_t *buf, size_t len) {
    for (size_t i = 0; i < len; ++i) {
        printf("%02x", buf[i]);
    }
    printf("\n");
}

int main(void) {
    const char *alg = "Kyber512"; // change if you prefer another supported KEM

    // Create KEM object
    OQS_KEM *kem = OQS_KEM_new(alg);
    if (kem == NULL) {
        fprintf(stderr, "KEM %s not available in this liboqs build.\n", alg);
        return EXIT_FAILURE;
    }

    printf("Using KEM: %s\n", kem->method_name);
    printf("Public key length: %zu\n", kem->length_public_key);
    printf("Secret key length: %zu\n", kem->length_secret_key);
    printf("Ciphertext length: %zu\n", kem->length_ciphertext);
    printf("Shared secret length: %zu\n\n", kem->length_shared_secret);

    uint8_t *pk = malloc(kem->length_public_key);
    uint8_t *sk = malloc(kem->length_secret_key);
    uint8_t *ct = malloc(kem->length_ciphertext);
    uint8_t *ss_bob = malloc(kem->length_shared_secret);
    uint8_t *ss_alice = malloc(kem->length_shared_secret);

    if (!pk || !sk || !ct || !ss_bob || !ss_alice) {
        fprintf(stderr, "malloc failed\n");
        OQS_KEM_free(kem);
        return EXIT_FAILURE;
    }

    struct timespec t0, t1;
    double t_keygen_ms, t_encaps_ms, t_decaps_ms;

    // Key generation (Alice)
    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_keypair(kem, pk, sk) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_keypair failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    t_keygen_ms = timespec_to_ms(&t0, &t1);

    // Encapsulation (Bob -> uses Alice's public key)
    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_encaps(kem, ct, ss_bob, pk) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_encaps failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    t_encaps_ms = timespec_to_ms(&t0, &t1);

    // Decapsulation (Alice)
    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_decaps(kem, ss_alice, ct, sk) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_decaps failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    t_decaps_ms = timespec_to_ms(&t0, &t1);

    // Print secrets and compare
    printf("Bob's shared secret  : ");
    print_hex(ss_bob, kem->length_shared_secret);
    printf("Alice's shared secret: ");
    print_hex(ss_alice, kem->length_shared_secret);

    if (memcmp(ss_bob, ss_alice, kem->length_shared_secret) == 0) {
        printf("\nSUCCESS: shared secrets match.\n");
    } else {
        printf("\nFAILURE: shared secrets DO NOT match.\n");
    }

    printf("\nTimings (single-run):\n");
    printf("  Key generation: %.3f ms\n", t_keygen_ms);
    printf("  Encapsulation : %.3f ms\n", t_encaps_ms);
    printf("  Decapsulation : %.3f ms\n", t_decaps_ms);

cleanup:
    // Clean sensitive material
    if (ss_bob) OQS_MEM_cleanse(ss_bob, kem->length_shared_secret);
    if (ss_alice) OQS_MEM_cleanse(ss_alice, kem->length_shared_secret);
    if (sk) OQS_MEM_cleanse(sk, kem->length_secret_key);

    free(pk);
    free(sk);
    free(ct);
    free(ss_bob);
    free(ss_alice);

    OQS_KEM_free(kem);
    return EXIT_SUCCESS;
}
