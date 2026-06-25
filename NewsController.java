package com.example.dashboard.news;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class NewsController {

    // application.properties에 설정된 API 키를 주입받습니다.
    @Value("${newsapi.api.key}")
    private String apiKey;

    private final String API_URL = "https://newsapi.org/v2/top-headlines";

    @GetMapping("/api/news")
    public ResponseEntity<String> getNews(@RequestParam(defaultValue = "technology") String category) {
        // API 키가 설정되지 않았거나 임시 키인 경우, 에러를 발생시키지 않고 빈 데이터를 반환합니다.
        // 이렇게 하면 서버가 멈추는 문제를 원천적으로 방지할 수 있습니다.
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("TEMPORARY_KEY")) {
            // 클라이언트가 JSON을 기대하므로, 비어있는 기사 목록을 담은 JSON 문자열을 반환합니다.
            return ResponseEntity.ok("{\"status\":\"ok\", \"totalResults\":0, \"articles\":[]}");
        }

        RestTemplate restTemplate = new RestTemplate();
        try {
            String requestUrl = UriComponentsBuilder.fromUriString(API_URL)
                    .queryParam("country", "jp")
                    .queryParam("category", category)
                    .queryParam("apiKey", apiKey)
                    .toUriString();

            String newsData = restTemplate.getForObject(requestUrl, String.class);
            return ResponseEntity.ok(newsData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("뉴스 정보를 가져오는 데 실패했습니다: " + e.getMessage());
        }
    }
}