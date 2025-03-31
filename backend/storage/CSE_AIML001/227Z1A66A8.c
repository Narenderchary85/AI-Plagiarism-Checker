// #include<stdio.h>
// #include<stdlib.h>
// #define M 10
// void main(){
// int p[M],o,b,n,r=0;
// printf("enter the no of packets: ");
// scanf("%d",&n);
// printf("Enter the packtes: \n");
// for (int i = 0; i < n; i++)
// {
//     printf("packet %d: ",i+1);
//     scanf("%d",&p[i]);
// }
// printf("Enter the bucket size: ");
// scanf("%d",&b);
// printf("Enter the output rate: ");
// scanf("%d",&o);
// int i=0;
// while(i<n){
// printf("Time %d\n",i+1);
// r=p[i]-o;
// r=abs(r);
// printf("Remainder: %d\n",r);
// p[i]=p[i]+r;
// i++;
// }
// }

#include <stdio.h>
#include <stdlib.h>
#define M 10

void main() {
    int p[M], o, b, n, r = 0;
    printf("Enter the number of packets: ");
    scanf("%d", &n);

    printf("Enter the packets:\n");
    for (int i = 0; i < n; i++) {
        printf("Packet %d: ", i + 1);
        scanf("%d", &p[i]);
    }

    printf("Enter the bucket size: ");
    scanf("%d", &b);

    printf("Enter the output rate: ");
    scanf("%d", &o);

    int time = 1;
    for (int i = 0; i < n; i++) {
        printf("\nTime %d:\n", time++);
        printf("Packet: %d\n", p[i]);

        // Add current packet to the bucket (considering bucket size)
        if (r + p[i] <= b) {
            r += p[i];  // add packet to the bucket
        } else {
            printf("Bucket overflow. Packet %d discarded.\n", i + 1);
            continue;
        }

        // Process the bucket content until remainder is zero
        while (r > 0) {
            printf("Output rate: %d\n", (r > o ? o : r));
            r = (r > o) ? r - o : 0;
            printf("Remainder: %d\n", r);
            if (r > 0) {
                printf("\nTime %d:\n", time++);
            }
        }
    }

    // Process remaining data if any after all packets are done
    while (r > 0) {
        printf("\nTime %d:\n", time++);
        printf("Remainder: %d\n", r);
        printf("Output rate: %d\n", (r > o ? o : r));
        r = (r > o) ? r - o : 0;
        printf("Remainder: %d\n", r);
    }
}
