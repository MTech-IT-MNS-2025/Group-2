// process_server.c  (Backend)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

uint64_t modexp(uint64_t a, uint64_t b, uint64_t n) {
    uint64_t result = 1;
    a = a % n;
    while (b > 0) {
        if (b & 1) result = (result * a) % n;
        a = (a * a) % n;
        b >>= 1;
    }
    return result;
}

int main(int argc, char *argv[]) {
    if (argc < 5) {
        fprintf(stderr, "Usage: modexp_server <g> <p> <x> <b>\n");
        return 1;
    }

    uint64_t g = strtoull(argv[1], NULL, 10);
    uint64_t p = strtoull(argv[2], NULL, 10);
    uint64_t x = strtoull(argv[3], NULL, 10);
    uint64_t b = strtoull(argv[4], NULL, 10);

    uint64_t y = modexp(g, b, p);
    uint64_t K = modexp(x, b, p);

    // print K then y separated by a space
    printf("%llu %llu", (unsigned long long)K, (unsigned long long)y);
    return 0;
}
