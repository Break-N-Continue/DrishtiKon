package com.drishti.kon.dto;

public class LinksResponse {

    private String bugReportUrl;
    private String featureRequestUrl;
    private String reportPostUrl;

    public LinksResponse() {}

    public LinksResponse(String bugReportUrl, String featureRequestUrl, String reportPostUrl) {
        this.bugReportUrl = bugReportUrl;
        this.featureRequestUrl = featureRequestUrl;
        this.reportPostUrl = reportPostUrl;
    }

    public String getBugReportUrl() { return bugReportUrl; }
    public void setBugReportUrl(String bugReportUrl) { this.bugReportUrl = bugReportUrl; }

    public String getFeatureRequestUrl() { return featureRequestUrl; }
    public void setFeatureRequestUrl(String featureRequestUrl) { this.featureRequestUrl = featureRequestUrl; }

    public String getReportPostUrl() { return reportPostUrl; }
    public void setReportPostUrl(String reportPostUrl) { this.reportPostUrl = reportPostUrl; }
}
