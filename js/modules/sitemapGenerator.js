// Sitemap Generator Module
export class SitemapGenerator {
    constructor() {
        // 저장된 도메인 사용, 없으면 현재 도메인
        this.baseUrl = window.siteData?.site?.domain || window.location.origin;
        
        // URL 형식 정규화 (https:// 추가)
        if (this.baseUrl && !this.baseUrl.startsWith('http')) {
            this.baseUrl = 'https://' + this.baseUrl;
        }
        
        // 말단 슬래시 제거
        this.baseUrl = this.baseUrl.replace(/\/$/, '');
        
        // 활성화된 섹션만 포함
        this.sections = this.getActiveSections();
    }
    
    getActiveSections() {
        const sections = [
            { path: '', priority: '1.0', name: 'main' } // 메인은 항상 포함
        ];
        
        // 각 섹션의 visible 상태 확인
        const sectionConfigs = [
            { path: '#overview', priority: '0.8', name: 'overview', dataKey: 'overview' },
            { path: '#design', priority: '0.8', name: 'design', dataKey: 'design' },
            { path: '#location', priority: '0.8', name: 'location', dataKey: 'location' },
            { path: '#floorplans', priority: '0.8', name: 'floorplans', dataKey: 'floorPlans' },
            { path: '#premium', priority: '0.7', name: 'premium', dataKey: 'premium' },
            { path: '#options', priority: '0.7', name: 'options', dataKey: 'options' },
            { path: '#convenience', priority: '0.7', name: 'convenience', dataKey: 'convenience' },
            { path: '#community', priority: '0.7', name: 'community', dataKey: 'community' },
            { path: '#news', priority: '0.6', name: 'news', dataKey: 'news' },
            { path: '#qna', priority: '0.6', name: 'qna', dataKey: 'qna' },
            { path: '#contact', priority: '0.9', name: 'contact', dataKey: 'contact' }
        ];
        
        // window.siteData가 있으면 visible 상태 확인
        if (window.siteData) {
            sectionConfigs.forEach(section => {
                // 섹션 데이터가 있고 visible이 false가 아니면 포함
                // contact는 항상 포함 (visible 속성 없음)
                if (section.dataKey === 'contact' || 
                    (window.siteData[section.dataKey] && 
                     window.siteData[section.dataKey].visible !== false)) {
                    sections.push({
                        path: section.path,
                        priority: section.priority,
                        name: section.name
                    });
                }
            });
        } else {
            // siteData가 없으면 기본 섹션만 포함
            sections.push(
                { path: '#overview', priority: '0.8', name: 'overview' },
                { path: '#location', priority: '0.8', name: 'location' },
                { path: '#floorplans', priority: '0.8', name: 'floorplans' },
                { path: '#contact', priority: '0.9', name: 'contact' }
            );
        }
        
        return sections;
    }

    generateSitemapXML() {
        const today = new Date().toISOString().split('T')[0];
        
        // SPA 구조에서는 해시(#) URL을 별도 페이지로 등록하지 않음
        // 메인 페이지와 개인정보처리방침 페이지만 등록
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- 메인 페이지 -->
    <url>
        <loc>${this.baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- 개인정보처리방침 페이지 (별도 HTML) -->
    <url>
        <loc>${this.baseUrl}/privacy.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;

        return xml;
    }

    generateRobotsTxt() {
        // 프로젝트명을 여러 소스에서 가져오기 시도
        const projectTitle = 
            document.getElementById('site-title')?.value || // 관리자 패널에서 직접 가져오기
            window.siteData?.site?.title || 
            '김포 오퍼스 한강 스위첸';
        
        // 간소화된 robots.txt - 필수 사항만 포함
        const robotsTxt = `# robots.txt for ${projectTitle}
# Generated: ${new Date().toISOString().split('T')[0]}

# 모든 검색엔진 봇 허용
User-agent: *
Allow: /

# 관리자 페이지 및 데이터 폴더 제외
Disallow: /admin/
Disallow: /data/

# 사이트맵 위치
Sitemap: ${this.baseUrl}/sitemap.xml`;

        return robotsTxt;
    }

    // 다운로드 함수
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // sitemap.xml 다운로드
    downloadSitemap() {
        const xml = this.generateSitemapXML();
        this.downloadFile(xml, 'sitemap.xml', 'application/xml');
    }

    // robots.txt 다운로드
    downloadRobotsTxt() {
        const txt = this.generateRobotsTxt();
        this.downloadFile(txt, 'robots.txt', 'text/plain');
    }

    // 두 파일 모두 다운로드
    downloadBoth() {
        this.downloadSitemap();
        setTimeout(() => {
            this.downloadRobotsTxt();
        }, 500); // 브라우저가 두 다운로드를 처리할 수 있도록 약간의 딜레이
    }

    // 미리보기 생성
    getPreview() {
        return {
            sitemap: this.generateSitemapXML(),
            robots: this.generateRobotsTxt()
        };
    }
}

// 전역으로 사용할 수 있도록 설정
window.SitemapGenerator = SitemapGenerator;