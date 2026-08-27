package com.drishti.kon.dto;

import java.util.List;

/**
 * Simple list wrapper for paginated responses.
 *
 * Spring Data Page<T> has been removed (no JPA). Pagination is returned as a
 * plain list. DynamoDB-style cursor-based pagination can be added when needed
 * using LastEvaluatedKey tokens.
 */
public class PageResponseDto<T> {

    private List<T> items;
    private int totalElements;

    public PageResponseDto() {}

    public static <T> PageResponseDto<T> fromList(List<T> items) {
        PageResponseDto<T> dto = new PageResponseDto<>();
        dto.setItems(items);
        dto.setTotalElements(items.size());
        return dto;
    }

    public List<T> getItems() { return items; }
    public void setItems(List<T> items) { this.items = items; }

    public int getTotalElements() { return totalElements; }
    public void setTotalElements(int totalElements) { this.totalElements = totalElements; }
}
