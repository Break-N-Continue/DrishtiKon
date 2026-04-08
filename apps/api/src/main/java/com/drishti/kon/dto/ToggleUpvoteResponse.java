package com.drishti.kon.dto;

public class ToggleUpvoteResponse {

    private boolean upvoted;
    private long count;

    public ToggleUpvoteResponse() {}

    public ToggleUpvoteResponse(boolean upvoted, long count) {
        this.upvoted = upvoted;
        this.count = count;
    }

    public boolean isUpvoted() {
        return upvoted;
    }

    public void setUpvoted(boolean upvoted) {
        this.upvoted = upvoted;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
