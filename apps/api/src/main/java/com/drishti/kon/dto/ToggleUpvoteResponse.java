package com.drishti.kon.dto;

public class ToggleUpvoteResponse {

    private Long postId;
    private boolean upvoted;
    private long upvoteCount;

    public ToggleUpvoteResponse() {}

    public ToggleUpvoteResponse(Long postId, boolean upvoted, long upvoteCount) {
        this.postId = postId;
        this.upvoted = upvoted;
        this.upvoteCount = upvoteCount;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public boolean isUpvoted() {
        return upvoted;
    }

    public void setUpvoted(boolean upvoted) {
        this.upvoted = upvoted;
    }

    public long getUpvoteCount() {
        return upvoteCount;
    }

    public void setUpvoteCount(long upvoteCount) {
        this.upvoteCount = upvoteCount;
    }
}
