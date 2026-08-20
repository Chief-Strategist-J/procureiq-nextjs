package com.procureiq.springboot_app.infra.clients;

import com.procureiq.springboot_app.infra.config.TracingHelper;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class CentralHttpClient {

    private final RestTemplate restTemplate;

    public CentralHttpClient() {
        this.restTemplate = new RestTemplate();
    }

    public HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        return headers;
    }

    public HttpHeaders basicAuthHeaders(String username, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(username, password);
        return headers;
    }

    public <T> T get(String urlTemplate, Class<T> responseType, Object... uriVariables) {
        return TracingHelper.executeServiceWithTracing(() -> {
            HttpEntity<Void> entity = new HttpEntity<>(jsonHeaders());
            ResponseEntity<T> response = restTemplate.exchange(
                    urlTemplate, HttpMethod.GET, entity, responseType, uriVariables);
            return response.getBody();
        });
    }

    public <T, R> R post(String url, T body, Class<R> responseType) {
        return TracingHelper.executeServiceWithTracing(() -> {
            HttpEntity<T> entity = new HttpEntity<>(body, jsonHeaders());
            ResponseEntity<R> response = restTemplate.postForEntity(url, entity, responseType);
            return response.getBody();
        });
    }

    public <R> R postWithBearer(String url, Object body, String token, Class<R> responseType) {
        return TracingHelper.executeServiceWithTracing(() -> {
            HttpEntity<Object> entity = new HttpEntity<>(body, bearerHeaders(token));
            ResponseEntity<R> response = restTemplate.postForEntity(url, entity, responseType);
            return response.getBody();
        });
    }

    public <R> R postForm(String url, MultiValueMap<String, String> form,
                          String username, String password, Class<R> responseType) {
        return TracingHelper.executeServiceWithTracing(() -> {
            HttpEntity<MultiValueMap<String, String>> entity =
                    new HttpEntity<>(form, basicAuthHeaders(username, password));
            ResponseEntity<R> response = restTemplate.postForEntity(url, entity, responseType);
            return response.getBody();
        });
    }
}
