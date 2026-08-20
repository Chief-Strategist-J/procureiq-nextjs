package com.procureiq.springboot_app.shared.pipeline;

import java.util.function.Consumer;
import java.util.function.Function;

public class AuthPipeline<T> {

    private final T value;

    private AuthPipeline(T value) {
        this.value = value;
    }

    public static <T> AuthPipeline<T> of(T value) {
        return new AuthPipeline<>(value);
    }

    public <R> AuthPipeline<R> map(Function<T, R> mapper) {
        return new AuthPipeline<>(mapper.apply(value));
    }

    public AuthPipeline<T> peek(Consumer<T> consumer) {
        consumer.accept(value);
        return this;
    }

    public T get() {
        return value;
    }

    public Void executeVoid() {
        return null;
    }
}
