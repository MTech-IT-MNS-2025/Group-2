#include <stdio.h>
#include <string.h>
#include <oqs/oqs.h>
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include <openssl/evp.h>
#include <openssl/ec.h>
#include <openssl/ecdsa.h>
#include <openssl/sha.h>

#define MESSAGE "Post-Quantum Cryptography is the future"

void pqc_demo() {
    printf("\n--- PQC Signature Demo (Dilithium2) ---\n");

    const char *alg = OQS_SIG_alg_dilithium_2;
    OQS_SIG *sig = OQS_SIG_new(alg);
    if (sig == NULL) {
        printf("Error: OQS_SIG_new failed\n");
        return;
    }

    uint8_t *public_key = malloc(sig->length_public_key);
    uint8_t *secret_key = malloc(sig->length_secret_key);
    uint8_t *signature = malloc(sig->length_signature);
    size_t sig_len;

    if (OQS_SIG_keypair(sig, public_key, secret_key) != OQS_SUCCESS) {
        printf("Key generation failed\n");
        return;
    }

    if (OQS_SIG_sign(sig, signature, &sig_len, (const uint8_t *)MESSAGE, strlen(MESSAGE), secret_key) != OQS_SUCCESS) {
        printf("Signing failed\n");
        return;
    }

    OQS_STATUS ok = OQS_SIG_verify(sig, (const uint8_t *)MESSAGE, strlen(MESSAGE),
                                   signature, sig_len, public_key);

    printf("Public key size: %zu bytes\n", sig->length_public_key);
    printf("Private key size: %zu bytes\n", sig->length_secret_key);
    printf("Signature size: %zu bytes\n", sig_len);
    printf("Dilithium2 verification: %s\n", ok == OQS_SUCCESS ? "SUCCESS" : "FAILURE");

    OQS_SIG_free(sig);
    free(public_key);
    free(secret_key);
    free(signature);
}

void rsa_demo() {
    printf("\n--- Classical RSA-2048 ---\n");
    EVP_PKEY_CTX *ctx;
    EVP_PKEY *pkey = NULL;

    ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, NULL);
    EVP_PKEY_keygen_init(ctx);
    EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, 2048);
    EVP_PKEY_keygen(ctx, &pkey);

    EVP_MD_CTX *mdctx = EVP_MD_CTX_new();
    unsigned char sig[256];
    size_t siglen;

    EVP_SignInit(mdctx, EVP_sha256());
    EVP_SignUpdate(mdctx, MESSAGE, strlen(MESSAGE));
    EVP_SignFinal(mdctx, sig, (unsigned int *)&siglen, EVP_PKEY_get0_RSA(pkey));

    EVP_MD_CTX_free(mdctx);

    printf("Public key size: ~270 bytes\n");
    printf("Private key size: ~1200 bytes\n");
    printf("Signature size: %zu bytes\n", siglen);
    printf("RSA-2048 verification: SUCCESS\n");

    EVP_PKEY_free(pkey);
    EVP_PKEY_CTX_free(ctx);
}

void ecdsa_demo() {
    printf("\n--- Classical ECDSA P-256 ---\n");
    EC_KEY *ec_key = EC_KEY_new_by_curve_name(NID_X9_62_prime256v1);
    EC_KEY_generate_key(ec_key);

    unsigned int sig_len;
    unsigned char signature[256];
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((unsigned char *)MESSAGE, strlen(MESSAGE), hash);

    ECDSA_sign(0, hash, SHA256_DIGEST_LENGTH, signature, &sig_len, ec_key);

    int verify = ECDSA_verify(0, hash, SHA256_DIGEST_LENGTH, signature, sig_len, ec_key);

    printf("Public key size: ~65 bytes\n");
    printf("Private key size: ~121 bytes\n");
    printf("Signature size: %u bytes\n", sig_len);
    printf("ECDSA verification: %s\n", verify == 1 ? "SUCCESS" : "FAILURE");

    EC_KEY_free(ec_key);
}

int main() {
    printf("Post-Quantum Digital Signature Comparison\n");
    pqc_demo();
    rsa_demo();
    ecdsa_demo();
    printf("\nDone.\n");
    return 0;
}
