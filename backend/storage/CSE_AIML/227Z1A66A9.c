#include<stdio.h>
#include<string.h>
void reciver(char *dev,char* gen,char* rem){
    int dlen,glen;
    char temp[100],qui[100];
    dlen=strlen(dev);
    glen=strlen(gen);
    for (int i = 0; i < glen-1; i++)
    {
        dev[dlen+i]=rem[i];
    }
    dev[dlen + glen - 1] = '\0';
    printf("The reciver devident: %s\n",dev);
    for (int i = 0; i < glen; i++)
    {
        temp[i]=dev[i];
    }
    temp[glen]='\0';
    for (int i = 0; i < dlen; i++) {
        qui[i] = temp[0];

        if (qui[i] == '1') {
            for (int j = 0; j < glen; j++) {
                temp[j] = temp[j] == gen[j] ? '0' : '1';
            }
        } else {
            for (int j = 0; j < glen; j++) {
                temp[j] = temp[j] == '0' ? '0' : '1'; 
            }
        }
        
        for (int j = 0; j < glen- 1; j++) {
            temp[j] = temp[j + 1];
        }
        temp[glen - 1] = dev[glen + i];
    }
    qui[dlen]='\0';
    strcpy(rem,temp);
    printf("the reciver reminder: %s\n",rem);

}

void main(){
    char dev[100],gen[100],temp[100],qui[100],rem[100],key[100],divdent[100];
    int dlen,glen;
    printf("Enter the devident:");
    scanf("%s",dev);
    printf("Enter the genarator:");
    scanf("%s",gen);
    dlen=strlen(dev);
    glen=strlen(gen);
    //strcpy(key,gen);
    for (int i = 0; i < dlen; i++)
    {
        divdent[i]=dev[i];
    }
    divdent[dlen]='\0';
    for (int i = 0; i < glen-1; i++)
    {
        dev[dlen+i]='0';
    }
    dev[dlen + glen - 1] = '\0';
        printf("The sender devident: %s\n",dev);
    for (int i = 0; i < glen; i++)
    {
        temp[i]=dev[i];
    }
    temp[glen]='\0';
    for (int i = 0; i < dlen; i++) {
        qui[i] = temp[0];

        if (qui[i] == '1') {
            for (int j = 0; j < glen; j++) {
                temp[j] = temp[j] == gen[j] ? '0' : '1';
            }
        } else {
            for (int j = 0; j < glen; j++) {
                temp[j] = temp[j] == '0' ? '0' : '1'; 
            }
        }
        
        for (int j = 0; j < glen- 1; j++) {
            temp[j] = temp[j + 1];
        }
        temp[glen - 1] = dev[glen + i];
    }
    qui[dlen]='\0';
    strcpy(rem,temp);
    printf("the sender reminder: %s\n",rem);

    reciver(divdent,gen,rem);
}
