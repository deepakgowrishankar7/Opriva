package com.opriva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OprivaApplication {

    public static void main(String[] args) {
        SpringApplication.run(OprivaApplication.class, args);
    }
}
