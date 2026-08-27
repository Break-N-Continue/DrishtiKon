package com.drishti.kon.entity;

/**
 * User roles (kept as enum for compile-time safety; stored as String in DynamoDB).
 */
public enum Role {
    STUDENT,
    STUDENT_COUNCIL,
    FACULTY,
    CLUB,
    JD,
    DIRO,
    MODERATOR,
    ADMIN
}
