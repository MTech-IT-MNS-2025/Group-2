// process.c  (WebAssembly client)
#include <stdint.h>
#include <inttypes.h> // for PRI macros if needed

uint64_t modexp(uint64_t a, uint64_t b, uint64_t n) {
    uint64_t result = 1;
    a = a % n;
    while (b > 0) {
        if (b & 1) {
            result = (result * a) % n;
        }
        a = (a * a) % n;
        b >>= 1;
    }
    return result;
}

// Exposed function called `process` which computes base^exp mod n
uint64_t process(uint64_t base, uint64_t exp, uint64_t n) {
    return modexp(base, exp, n);
}
