package com.opriva.service.adapter;

import java.io.InputStream;

public interface DocumentStorageAdapter {
    String storeFile(String key, byte[] content, String contentType);
    byte[] retrieveFile(String key);
    void deleteFile(String key);
}
