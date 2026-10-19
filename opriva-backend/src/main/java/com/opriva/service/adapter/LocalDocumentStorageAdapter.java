package com.opriva.service.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Component
public class LocalDocumentStorageAdapter implements DocumentStorageAdapter {

    private static final Logger log = LoggerFactory.getLogger(LocalDocumentStorageAdapter.class);
    private final Path storageDir;

    public LocalDocumentStorageAdapter(@Value("${opriva.storage.local-dir:./storage_data}") String storagePath) {
        this.storageDir = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            if (!Files.exists(this.storageDir)) {
                Files.createDirectories(this.storageDir);
            }
        } catch (IOException e) {
            log.error("Could not create local storage directory", e);
        }
    }

    @Override
    public String storeFile(String key, byte[] content, String contentType) {
        try {
            // Protect against path traversal attacks
            String sanitizedKey = key.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = storageDir.resolve(sanitizedKey).normalize();
            if (!targetPath.startsWith(storageDir)) {
                throw new SecurityException("Invalid storage key path traversal attempt");
            }
            Files.write(targetPath, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            return sanitizedKey;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store document in secure storage", e);
        }
    }

    @Override
    public byte[] retrieveFile(String key) {
        try {
            String sanitizedKey = key.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = storageDir.resolve(sanitizedKey).normalize();
            if (!targetPath.startsWith(storageDir) || !Files.exists(targetPath)) {
                throw new RuntimeException("File not found in storage: " + key);
            }
            return Files.readAllBytes(targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to retrieve document from storage", e);
        }
    }

    @Override
    public void deleteFile(String key) {
        try {
            String sanitizedKey = key.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = storageDir.resolve(sanitizedKey).normalize();
            if (targetPath.startsWith(storageDir)) {
                Files.deleteIfExists(targetPath);
            }
        } catch (IOException e) {
            log.warn("Failed to delete file from storage: {}", key, e);
        }
    }
}
