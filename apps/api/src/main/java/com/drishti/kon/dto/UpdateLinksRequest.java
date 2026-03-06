package com.drishti.kon.dto;

public class UpdateLinksRequest {

    private String bugReportUrl;
    private String featureRequestUrl;
    private String reportPostUrl;

    public String getBugReportUrl() { return bugReportUrl; }
    public void setBugReportUrl(String bugReportUrl) { this.bugReportUrl = bugReportUrl; }

    public String getFeatureRequestUrl() { return featureRequestUrl; }
    public void setFeatureRequestUrl(String featureRequestUrl) { this.featureRequestUrl = featureRequestUrl; }

    public String getReportPostUrl() { return reportPostUrl; }
    public void setReportPostUrl(String reportPostUrl) { this.reportPostUrl = reportPostUrl; }
}
