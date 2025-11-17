#include <stdlib.h>
#include <string.h>

unsigned char S[256];

void ksa(unsigned char *k, int l){
    for(int i=0;i<256;i++) S[i]=i;
    for(int i=0,j=0;i<256;i++){
        j=(j+S[i]+k[i%l])&255;
        unsigned char t=S[i]; S[i]=S[j]; S[j]=t;
    }
}

void prga(unsigned char *d,int n){
    for(int i=0,j=0,x=0;x<n;x++){
        i=(i+1)&255; j=(j+S[i])&255;
        unsigned char t=S[i]; S[i]=S[j]; S[j]=t;
        d[x]^=S[(S[i]+S[j])&255];
    }
}

__attribute__((export_name("rc4")))
unsigned char* rc4(unsigned char *t,int n,unsigned char *k,int l){
    ksa(k,l);
    unsigned char *o=malloc(n);
    memcpy(o,t,n);
    prga(o,n);
    return o;
}
