package com.drishti.kon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DrishtiKonApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrishtiKonApplication.class, args);
    }
}
