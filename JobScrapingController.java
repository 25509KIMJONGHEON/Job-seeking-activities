package com.example.dashboard.job;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class JobScrapingController {


    // 스크레이핑 결과를 담을 데이터 클래스 (DTO)
    public static class JobPosting {
        private String title;
        private String company;
        private List<String> tags; // "NEW", "WEB面接" 등 태그
        private String location; // 근무지
        private String url;

        // 생성자, Getter
        public JobPosting(String title, String company, List<String> tags, String location, String url) {
            this.title = title;
            this.company = company;
            this.tags = tags;
            this.location = location;
            this.url = url;
        }
        public String getTitle() { return title; }
        public String getCompany() { return company; }
        public List<String> getTags() { return tags; }
        public String getLocation() { return location; }
        public String getUrl() { return url; }
    }

    @GetMapping("/api/jobs")
    public ResponseEntity<List<JobPosting>> scrapeJobPostings() {
        // 실제 마이나비 2026 사이트의 IT 엔지니어 검색 결과 페이지
        String targetUrl = "https://job.mynavi.jp/26/pc/search/corpsearch.html?職種=1622&勤務地=27";
        List<JobPosting> jobPostings = new ArrayList<>();

        try {
            // 1. Jsoup으로 웹사이트에 연결하여 HTML 문서를 가져옵니다.
            Document doc = Jsoup.connect(targetUrl).userAgent("Mozilla/5.0").get();

            // 2. CSS 선택자를 사용하여 원하는 정보가 담긴 요소들을 선택합니다.
            // (주의: 마이나비 사이트의 구조가 바뀌면 이 부분은 동작하지 않을 수 있습니다.)
            Elements jobElements = doc.select(".boxCorp");

            for (Element jobEl : jobElements) {
                String company = jobEl.select("h3.corpName a").text();
                String title = jobEl.select("p.catchCopy").text();
                String url = jobEl.select("h3.corpName a").attr("abs:href");
                String location = jobEl.select(".corpDesc > dl > dd").first().text();
                
                List<String> tags = new ArrayList<>();
                for (Element tagEl : jobEl.select(".icon_corp img")) {
                    tags.add(tagEl.attr("alt"));
                }

                if (!company.isEmpty()) {
                    jobPostings.add(new JobPosting(title, company, tags, location, url));
                }
            }
            return ResponseEntity.ok(jobPostings);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}