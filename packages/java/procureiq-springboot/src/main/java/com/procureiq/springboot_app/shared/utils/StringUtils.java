package com.procureiq.springboot_app.shared.utils;

public final class StringUtils {

    private StringUtils() {}

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String normalize(String str) {
        if (isEmpty(str)) {
            return "";
        }
        return str.trim().toLowerCase().replaceAll("\\s+", "");
    }

    public static boolean safeEqualsStrict(String str1, String str2) {
        if (isEmpty(str1) && isEmpty(str2)) {
            return true;
        }
        if (isEmpty(str1) || isEmpty(str2)) {
            return false;
        }
        return normalize(str1).equals(normalize(str2));
    }

    public static boolean safeEqualsIgnoreCase(String str1, String str2) {
        if (isEmpty(str1) && isEmpty(str2)) {
            return true;
        }
        if (isEmpty(str1) || isEmpty(str2)) {
            return false;
        }
        return str1.trim().equalsIgnoreCase(str2.trim());
    }
}
