#include <stdio.h>
#include <stdint.h>

// modular exponentiation: computes a^b mod n
uint64_t modexp(uint64_t a, uint64_t b, uint64_t n) {
    uint64_t result = 1;
    a = a % n;  // reduce 'a' first

    while (b > 0) {
        if (b & 1) {
            result = (result * a) % n;
        }
        a = (a * a) % n;
        b >>= 1;
    }
    return result;
}

int main() {
    // This main keeps the file runnable natively if compiled with gcc.
    uint64_t a, b, n;
    printf("Enter a, b, n: ");
    if (scanf("%lu %lu %lu", &a, &b, &n) == 3) {
        printf("%lu^%lu mod %lu = %lu\n", a, b, n, modexp(a, b, n));
    }
    return 0;
}
