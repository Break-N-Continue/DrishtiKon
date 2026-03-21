package com.drishti.kon.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public class PageResponseDto<T> {

    private List<T> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    public static <T> PageResponseDto<T> fromPage(Page<T> pageData) {
        PageResponseDto<T> dto = new PageResponseDto<>();
        dto.setItems(pageData.getContent());
        dto.setPage(pageData.getNumber());
        dto.setSize(pageData.getSize());
        dto.setTotalElements(pageData.getTotalElements());
        dto.setTotalPages(pageData.getTotalPages());
        dto.setHasNext(pageData.hasNext());
        dto.setHasPrevious(pageData.hasPrevious());
        return dto;
    }

    public List<T> getItems() { return items; }
    public void setItems(List<T> items) { this.items = items; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public boolean isHasNext() { return hasNext; }
    public void setHasNext(boolean hasNext) { this.hasNext = hasNext; }

    public boolean isHasPrevious() { return hasPrevious; }
    public void setHasPrevious(boolean hasPrevious) { this.hasPrevious = hasPrevious; }
}
