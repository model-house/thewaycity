// Section Renderer Module
import { DesignRenderer } from './designRenderer.js';

export class SectionRenderer {
    constructor() {
        this.designRenderer = new DesignRenderer();
    }
    renderHero(data) {
        // 슬라이드 이미지 배열 - JSON에서 가져오거나 기본값 사용
        let slideImages = [];
        
        // slideImages가 있으면 사용, 없으면 backgroundImage 사용
        if (data.slideImages && data.slideImages.length > 0) {
            slideImages = data.slideImages;
        } else if (data.backgroundImage) {
            // 기존 호환성을 위해 backgroundImage만 있는 경우
            slideImages = [data.backgroundImage];
        } else {
            // 둘 다 없으면 기본 이미지
            slideImages = ['assets/images/hero/hero.jpg'];
        }
        
        return `
            <section id="hero" class="hero-section">
                <!-- 슬라이드 배경 -->
                <div class="hero-slider">
                    ${slideImages.map((img, index) => `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}" 
                             style="background-image: url('${img}')" 
                             data-slide="${index}"></div>
                    `).join('')}
                </div>
                
                <!-- 오버레이 -->
                <div class="hero-overlay"></div>
                
                <!-- 컨텐츠 -->
                <div class="hero-content">
                    <h1 class="hero-title">${data.title}</h1>
                    <p class="hero-subtitle">${data.subtitle}</p>
                    
                    <!-- 그랜드 오픈 뱃지 버튼 스타일 -->
                    <div class="grand-open-badge">
                        <span class="badge-text">GRAND OPEN</span>
                    </div>
                </div>
                
                <!-- 슬라이드 인디케이터 -->
                <div class="slide-indicators">
                    ${slideImages.map((_, index) => `
                        <span class="slide-dot ${index === 0 ? 'active' : ''}" 
                              data-slide="${index}"></span>
                    `).join('')}
                </div>
            </section>
        `;
    }

    renderDesign(data) {
        return this.designRenderer.render(data);
    }
    
    renderOverview(data) {
        // 이미지 배열을 데이터에서 가져오거나 기본값 사용
        const slideImages = data.images || [
            'assets/images/gaeyo/gaeyo1.jpg',
            'assets/images/gaeyo/gaeyo2.jpg',
            'assets/images/gaeyo/gaeyo3.jpg'
        ];
        
        // 기본값 설정
        const title = data.title || '사업개요';
        const items = data.items || [];
        
        return `
            <section id="overview" class="section overview-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${title}</h2>
                    </div>
                    <div class="overview-content">
                        <div class="overview-info">
                            ${items.map(item => `
                                <div class="overview-item">
                                    <span class="overview-label">${item.label}</span>
                                    <span class="overview-value">${item.value}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="overview-slider-wrapper">
                            <button class="overview-slider-btn prev" aria-label="이전 슬라이드">
                                <span>‹</span>
                            </button>
                            <div class="overview-image-container">
                                <div class="overview-slider">
                                    <div class="overview-slides">
                                        ${slideImages.map((img, index) => `
                                            <div class="overview-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                                                <img src="${img}" alt="사업개요 ${index + 1}" loading="lazy">
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            <button class="overview-slider-btn next" aria-label="다음 슬라이드">
                                <span>›</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderLocation(data) {
        return `
            <section id="location" class="section location-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title}</h2>
                        <p class="section-description">${data.description}</p>
                    </div>
                    <div class="location-content">
                        <div class="location-highlights">
                            ${data.highlights.map(item => `
                                <div class="highlight-card">
                                    <div class="highlight-icon">${item.icon}</div>
                                    <div class="highlight-content">
                                        <h3 class="highlight-title">${item.title}</h3>
                                        <p class="highlight-description">${item.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ${data.image ? `
                            <div class="location-image">
                                <div class="location-image-container" onclick="openImageOverlay('${data.image}')">
                                    <img src="${data.image}" alt="${data.title}" loading="lazy">
                                    <div class="map-zoom-hint">
                                        <span>클릭하면 크게 볼 수 있습니다</span>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- 이미지 확대 오버레이 -->
                <div id="imageOverlay" class="image-overlay" onclick="closeImageOverlay()">
                    <span class="image-overlay-close">×</span>
                    <img id="overlayImage" src="" alt="확대 이미지">
                </div>
            </section>
        `;
    }

    renderLayout(data) {
        if (!data || data.visible === false) return '';
        
        return `
            <section id="layout" class="section layout-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '단지 배치도'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    
                    ${data.features && data.features.length > 0 ? `
                        <div class="layout-features">
                            ${data.features.map(feature => `
                                <div class="layout-feature">
                                    <h3 class="feature-title">${feature.title}</h3>
                                    <p class="feature-description">${feature.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${data.images && data.images.length > 0 ? `
                        <div class="layout-slider-container">
                            <div class="layout-slider-wrapper">
                                <button class="layout-slider-btn prev" onclick="window.moveLayoutSlide && moveLayoutSlide(-1)">
                                    <span>‹</span>
                                </button>
                                <div class="layout-slider">
                                    <div class="layout-slides" id="layout-slides">
                                        ${data.images.map((image, index) => `
                                            <div class="layout-slide" data-slide="${index}">
                                                <img src="${image}" alt="배치도 ${index + 1}" loading="lazy"
                                                     onclick="openImageOverlay('${image}')">
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <button class="layout-slider-btn next" onclick="window.moveLayoutSlide && moveLayoutSlide(1)">
                                    <span>›</span>
                                </button>
                            </div>
                            
                            <!-- 슬라이드 인디케이터 -->
                            <div class="layout-slide-indicators">
                                ${data.images.map((_, index) => `
                                    <span class="slide-dot ${index === 0 ? 'active' : ''}" 
                                          onclick="window.goToLayoutSlide && goToLayoutSlide(${index})"
                                          data-slide="${index}"></span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    }

    renderFloorPlans(data) {
        return `
            <section id="floorplans" class="section floorplans-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title}</h2>
                        <p class="section-description">${data.description}</p>
                    </div>
                    
                    <!-- 평면도 선택 리스트 (PC용) -->
                    <div class="floorplan-selector desktop-selector" id="floorplan-selector">
                        ${data.plans ? data.plans.map((plan, index) => `
                            <div class="selector-item ${index === 0 ? 'active' : ''}" 
                                 data-index="${index}" 
                                 data-type="${plan.type}">
                                <span class="selector-type">${plan.type}</span>
                                <span class="selector-area">${plan.area}</span>
                                ${plan.units ? `<span class="selector-units">${plan.units}</span>` : ''}
                            </div>
                        `).join('') : ''}
                    </div>
                    
                    <!-- 평면도 드롭다운 (모바일용) -->
                    <div class="floorplan-selector mobile-selector">
                        <select class="floorplan-dropdown" id="floorplan-dropdown">
                            ${data.plans ? data.plans.map((plan, index) => `
                                <option value="${index}" ${index === 0 ? 'selected' : ''}>
                                    ${plan.type} - ${plan.area} ${plan.units ? `(${plan.units})` : ''}
                                </option>
                            `).join('') : ''}
                        </select>
                    </div>
                    
                    <!-- 선택된 평면도 상세 정보 -->
                    <div class="floorplan-detail-container">
                        <!-- 좌측: 평면도 정보 -->
                        <div class="floorplan-info-section">
                            <!-- 평면도 기본 정보 -->
                            <div class="floorplan-basic-info">
                                <div class="info-header">
                                    <h3 class="current-type" id="current-type">${data.plans && data.plans[0] ? data.plans[0].type : ''}</h3>
                                    <span class="current-area" id="current-area">${data.plans && data.plans[0] ? data.plans[0].area : ''}</span>
                                </div>
                                <div class="info-summary" id="floorplan-summary">
                                    ${data.plans && data.plans[0] && data.plans[0].units ? `
                                        <div class="summary-item">
                                            <span class="summary-label">세대수:</span>
                                            <span class="summary-value">${data.plans[0].units}</span>
                                        </div>
                                    ` : ''}
                                    ${data.plans && data.plans[0] && data.plans[0].description ? `
                                        <div class="summary-item">
                                            <span class="summary-label">설명:</span>
                                            <span class="summary-value">${data.plans[0].description}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- 면적 상세 정보 -->
                            <div class="floorplan-area-details" id="floorplan-area-details">
                                <h4>면적 상세</h4>
                                <div class="area-details-list" id="area-details-list">
                                    ${data.plans && data.plans[0] && data.plans[0].areaDetails ? 
                                        data.plans[0].areaDetails.map(detail => `
                                            <div class="area-detail-item">
                                                <span class="detail-label">${detail.label}</span>
                                                <span class="detail-value">${detail.value}</span>
                                            </div>
                                        `).join('') : 
                                        '<div class="no-data">면적 상세 정보가 없습니다.</div>'
                                    }
                                </div>
                            </div>
                            
                            <!-- 특징 -->
                            <div class="floorplan-features" id="floorplan-features">
                                <h4>특징</h4>
                                <ul id="features-list">
                                    ${data.plans && data.plans[0] && data.plans[0].features ? 
                                        data.plans[0].features.map(feature => `<li>${feature}</li>`).join('') :
                                        '<li>특징 정보가 없습니다.</li>'
                                    }
                                </ul>
                            </div>
                        </div>
                        
                        <!-- 우측: 이미지 갤러리 섹션 -->
                        <div class="floorplan-gallery-section">
                            <!-- 메인 이미지 -->
                            <div class="gallery-main" id="gallery-main">
                                <img id="main-floorplan-image" 
                                     src="${data.plans && data.plans[0] ? data.plans[0].image : ''}" 
                                     alt="평면도"
                                     onclick="window.openImageViewer ? openImageViewer(this.src) : openImageOverlay(this.src)">
                                <div class="image-zoom-hint">
                                    <span>클릭하면 크게 볼 수 있습니다</span>
                                </div>
                            </div>
                            
                            <!-- 추가 이미지 썸네일 -->
                            <div class="gallery-thumbs" id="gallery-thumbs">
                                ${data.plans && data.plans[0] ? `
                                    <div class="thumb-item active" data-image="${data.plans[0].image}">
                                        <img src="${data.plans[0].image}" alt="메인 평면도">
                                    </div>
                                    ${data.plans[0].additionalImages ? 
                                        data.plans[0].additionalImages.map((img, idx) => `
                                            <div class="thumb-item" data-image="${img.url}">
                                                <img src="${img.url}" alt="${img.description || '추가 이미지'}">
                                            </div>
                                        `).join('') : ''
                                    }
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderPremium(data) {
        // 레이아웃 타입 결정 (cards, image-text, mixed)
        const layoutType = data.layoutType || 'cards';
        
        // 아이콘 매핑 (제목에 따라 자동 선택)
        const getIcon = (title) => {
            const iconMap = {
                '미래가치': '📈',
                '서울 빠른 쾌속교통': '🚇',
                '도보통학 우수한 교육환경': '🏫',
                '한강변의 직주근접': '🏢',
                '쾌적한 단지 설계': '🏗️',
                '스위첸 브랜드파워': '🏆',
                '스마트홈': '🏠',
                '친환경': '🌱',
                '프리미엄 마감재': '💎',
                '특화 설계': '✨'
            };
            
            // 제목에서 키워드 찾기
            for (const [key, icon] of Object.entries(iconMap)) {
                if (title.includes(key)) return icon;
            }
            return '⭐'; // 기본 아이콘
        };
        
        // 카드 레이아웃 렌더링
        const renderCards = () => `
            <div class="premium-grid">
                ${data.features.map((feature, index) => `
                    <div class="premium-card">
                        <div class="premium-icon">${feature.icon || getIcon(feature.title)}</div>
                        <h3 class="premium-title">${feature.title}</h3>
                        <p class="premium-description">${feature.description}</p>
                        ${feature.details ? `
                            <ul class="premium-details">
                                ${feature.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        // 이미지-텍스트 레이아웃 렌더링
        const renderImageText = () => `
            ${data.features.map((feature, index) => `
                <div class="premium-layout-image ${index % 2 === 1 ? 'reverse' : ''}">
                    <div class="premium-image-content">
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                        ${feature.details ? `
                            <ul>
                                ${feature.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                    <div class="premium-image-visual">
                        <img src="${feature.image || 'assets/images/premium-default.jpg'}" alt="${feature.title}" loading="lazy">
                    </div>
                </div>
            `).join('')}
        `;
        
        return `
            <section id="premium" class="section premium-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '프리미엄'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    <div class="premium-content">
                        ${layoutType === 'cards' ? renderCards() : ''}
                        ${layoutType === 'image-text' ? renderImageText() : ''}
                        ${layoutType === 'mixed' ? `
                            ${renderCards()}
                            <div style="margin-top: 80px;">
                                ${renderImageText()}
                            </div>
                        ` : ''}
                        ${data.additionalInfo ? `
                            <div class="premium-additional">
                                <div class="additional-content">
                                    ${data.additionalInfo}
                                </div>
                            </div>
                        ` : ''}
                        ${data.images && data.images.length > 0 ? `
                            <div class="premium-images">
                                ${data.images.map(img => `
                                    <div class="premium-image-item" onclick="openImageOverlay('${img.url || img}')">
                                        <img src="${img.url || img}" alt="${img.title || data.title}" loading="lazy">
                                        ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
    }

    renderConvenience(data) {
        return `
            <section id="convenience" class="section convenience-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '시스템'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                        ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
                    </div>
                    <div class="convenience-content">
                        ${data.facilities && data.facilities.length > 0 ? data.facilities.map(category => `
                            <div class="convenience-category">
                                <h3 class="category-title">${category.category}</h3>
                                <div class="convenience-items">
                                    ${category.items.map(item => `
                                        <div class="convenience-item">
                                            <div class="item-info">
                                                <h4 class="item-name">${item.name}</h4>
                                                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            </section>
        `;
    }

    renderCommunity(data) {
        // 기본 시설 데이터
        const defaultFacilities = [
            { name: '키즈카페', image: 'assets/images/community/1.jpg', description: '아이들을 위한 안전하고 재미있는 놀이공간' },
            { name: '영화감상공간', image: 'assets/images/community/2.jpg', description: '프라이빗 영화관에서 즐기는 특별한 시간' },
            { name: '피트니스 클럽', image: 'assets/images/community/3.jpg', description: '최첨단 시설의 프리미엄 피트니스' },
            { name: '도서관', image: 'assets/images/community/4.jpg', description: '조용한 독서와 학습을 위한 공간' },
            { name: '광장', image: 'assets/images/community/5.jpg', description: '주민들의 소통과 휴식을 위한 열린 공간' },
            { name: '음악 휴게공간', image: 'assets/images/community/6.jpg', description: '음악과 함께하는 힐링 라운지' },
            { name: '골프연습장', image: 'assets/images/community/7.jpg', description: '실내 골프 연습을 위한 전문 시설' },
            { name: '학습 공간', image: 'assets/images/community/8.jpg', description: '집중 학습을 위한 독립된 공간' }
        ];
        
        // facilities 데이터 정리
        let facilities = data.facilities || defaultFacilities;
        
        // 조감도와 평면도 이미지 경로 (별도 관리)
        const overviewImage = data.overviewImage || 'assets/images/community/main.jpg';
        const floorPlanImage = data.floorPlanImage || 'assets/images/community/sub.jpg';
        
        // 조감도/평면도 표시 설정 (기본값 true)
        const showOverview = data.showOverview !== false;
        const showFloorplan = data.showFloorplan !== false;
        
        // 왼쪽 이미지가 둘 다 숨겨져 있으면 레이아웃 조정 필요
        const hasLeftImages = showOverview || showFloorplan;
        
        return `
            <section id="community" class="section community-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '커뮤니티 시설'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    <div class="community-layout${!hasLeftImages ? ' no-left-images' : ''}">
                        ${hasLeftImages ? `
                        <!-- 왼쪽: 조감도/평면도 이미지 -->
                        <div class="community-left-images">
                            ${showOverview ? `
                            <div class="community-main-display" onclick="openImageOverlay('${overviewImage}')">
                                <img src="${overviewImage}" alt="커뮤니티 조감도" loading="lazy">
                                <div class="image-overlay-label">조감도</div>
                                <div class="image-zoom-hint">
                                    <span>클릭하면 크게 볼 수 있습니다</span>
                                </div>
                            </div>
                            ` : ''}
                            ${showFloorplan ? `
                            <div class="community-sub-display" onclick="openImageOverlay('${floorPlanImage}')">
                                <img src="${floorPlanImage}" alt="커뮤니티 서브" loading="lazy">
                                <div class="image-overlay-label">평면도</div>
                                <div class="image-zoom-hint">
                                    <span>클릭하면 크게 볼 수 있습니다</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        <!-- 오른쪽: 시설 카드 그리드 -->
                        <div class="community-right-cards">
                            <div class="facility-cards-grid">
                                ${facilities.map((facility, index) => {
                                // 이미지 경로 결정
                                const facilityImage = facility.image || facility.mainImage || 
                                `assets/images/community/${index + 1}.jpg`; // 기본 이미지 경로
                                
                                return `
                                <div class="facility-card" data-index="${index}">
                                <div class="facility-card-image">
                                    <img src="${facilityImage}" alt="${facility.name}" loading="lazy">
                                        <div class="facility-card-overlay">
                                                <h3 class="facility-overlay-name">${facility.name}</h3>
                                <p class="facility-overlay-desc">${facility.description}</p>
                            </div>
                        </div>
                    </div>
                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderOptions(data) {
        return `
            <section id="options" class="section options-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '기본 제공 품목 안내'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    
                    <div class="options-content">
                        ${data.categories ? data.categories.map(category => `
                            <div class="options-category">
                                <h3 class="category-title">${category.title}</h3>
                                <div class="options-grid">
                                    ${category.items.map((item, index) => `
                                        <div class="option-card ${item.special ? 'special' : ''}">
                                            <div class="option-info">
                                                <h4 class="option-title">${item.title}</h4>
                                                <p class="option-description">${item.description}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            </section>
        `;
    }

    renderNews(data) {
        return `
            <section id="news" class="section news-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '언론보도'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    <div class="news-content">
                        ${data.items && data.items.length > 0 ? `
                            <div class="news-list">
                                ${data.items.slice(0, 6).map((item, index) => `
                                    <div class="news-article" data-index="${index}">
                                        <h3 class="news-title">${item.title}</h3>
                                        <div class="news-meta">
                                            <span class="news-source">${item.source}</span>
                                            ${item.articleTitle && item.link ? `
                                                <a href="${item.link}" target="_blank" class="article-link">
                                                    「${item.articleTitle}」
                                                </a>
                                            ` : ''}
                                            <span class="news-date">(${item.date} 보도)</span>
                                        </div>
                                        <div class="news-body" id="news-body-${index}">
                                            <div class="news-content-wrap">
                                                ${this.formatNewsContent(item.content, item.ctaLink)}
                                            </div>
                                            <button class="news-toggle-btn" onclick="window.toggleNewsContent && toggleNewsContent(${index})">
                                                <span class="toggle-text">더보기</span>
                                                <span class="toggle-icon">▼</span>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            ${data.items.length > 6 ? `
                                <div class="news-more">
                                    <button class="btn-more-news" onclick="window.showMoreNews && showMoreNews()">
                                        더 많은 보도자료 보기
                                    </button>
                                </div>
                            ` : ''}
                        ` : `
                            <div class="no-news-items">
                                <p>등록된 보도자료가 없습니다.</p>
                            </div>
                        `}
                    </div>
                </div>
            </section>
        `;
    }

    formatNewsContent(content, ctaLink) {
        if (!content) return '';
        
        // 줄바꿈을 <br>로 변환
        let formatted = content.replace(/\n/g, '<br>');
        
        // **텍스트** 형식을 <strong>으로 변환
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // CTA 링크가 있고, **청약홈** 같은 텍스트가 있으면 링크로 변환
        if (ctaLink) {
            // <strong>태그 안에 있는 텍스트를 찾아서 링크로 감싸기
            formatted = formatted.replace(/<strong>(청약홈)<\/strong>/g, `<a href="${ctaLink}" target="_blank" class="cta-link"><strong>$1</strong></a>`);
        }
        
        // 특수문자 유지 (●, → 등)
        return formatted;
    }

    renderQna(data) {
        return `
            <section id="qna" class="section qna-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '자주 묻는 질문'}</h2>
                        ${data.description ? `<p class="section-description">${data.description}</p>` : ''}
                    </div>
                    <div class="qna-content">
                        <div class="qna-list">
                            ${data.items && data.items.length > 0 ? data.items.map((item, index) => `
                                <div class="qna-item ${index === 0 ? 'active' : ''}">
                                    <div class="qna-question" onclick="toggleQnaItem(${index})">
                                        <span class="qna-number">Q${(index + 1).toString().padStart(2, '0')}</span>
                                        <span class="qna-title">${item.question}</span>
                                        <span class="qna-toggle">
                                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="qna-answer">
                                        <div class="qna-answer-content">
                                            <span class="qna-answer-label">A</span>
                                            <div class="qna-answer-text">${item.answer}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="no-qna-items">
                                    <p>등록된 질문이 없습니다.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderContact(data) {
        // 기본값 설정
        const title = data.title || '상담 문의';
        const subtitle = data.subtitle || '위의 내용 중 궁금한 점이 있으신가요?';
        // 대표 전화번호(site.contact.phone)를 우선적으로 사용
        const phone = window.siteData?.site?.contact?.phone || data.phone || '1811-0000';
        // 운영시간도 site.contact.hours를 우선적으로 사용
        const hours = window.siteData?.site?.contact?.hours || data.hours || '오전 10시 - 오후 6시';
        // 주소도 site에서 가져오되, 없으면 contact.address 사용
        const address = window.siteData?.site?.contact?.address || data.address || '경기도 김포시 장기동 모델하우스';
        const kakao = data.kakao || '';
        // 프로젝트 제목은 site.title에서 가져오거나 기본값 사용
        const projectTitle = data.projectTitle || window.siteData?.site?.title || '김포 오퍼스 한강 스위첸';
        
        // 방문 가능 날짜 범위 설정 (data에서 가져오거나 site 설정에서 가져오기)
        const siteVisitRange = window.siteData?.site?.contact?.visitDateRange;
        const visitDateRange = data.visitDateRange || siteVisitRange || {
            startDate: new Date().toISOString().slice(0,10), // 오늘
            endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10) // 30일 후
        };
        
        // 시작일과 종료일이 비어있으면 기본값 사용
        if (!visitDateRange.startDate || !visitDateRange.endDate) {
            visitDateRange.startDate = new Date().toISOString().slice(0,10);
            visitDateRange.endDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10);
        }
        
        // form 데이터가 없을 경우 기본값 설정
        const form = data.form || {
            title: '관심고객 등록',
            fields: [
                { name: 'name', label: '성명', type: 'text', required: true },
                { name: 'phone', label: '연락처', type: 'tel', required: true, placeholder: '010-1234-5678' },
                { name: 'message', label: '문의사항', type: 'textarea', required: false, placeholder: '문의하실 내용을 입력해주세요' }
            ]
        };
        
        return `
            <section id="contact" class="section contact-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${title}</h2>
                        ${subtitle ? `<p class="section-description">${subtitle}</p>` : ''}
                    </div>
                    <div class="contact-content">
                        <!-- 문의 폼 카드 -->
                        <div class="contact-form-card">
                            <div class="form-header">
                                <h3 class="form-title">${projectTitle}<br class="mobile-br">방문예약</h3>
                            </div>
                            
                            <form id="contactForm">
                                <div class="form-group full-width">
                                    <label for="name">성명 <span>*</span></label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                <div class="form-group full-width">
                                    <label for="phone">연락처 <span>*</span></label>
                                    <input type="tel" id="phone" name="phone" placeholder="010-1234-5678" required>
                                </div>
                                <div class="form-group full-width">
                                    <label>방문인원 <span>*</span></label>
                                    <div class="radio-group">
                                        <label><input type="radio" name="visitors" value="1" required> 1명</label>
                                        <label><input type="radio" name="visitors" value="2"> 2명</label>
                                        <label><input type="radio" name="visitors" value="3"> 3명</label>
                                        <label><input type="radio" name="visitors" value="4+"> 4명 이상</label>
                                    </div>
                                </div>
                                <div class="form-group full-width">
                                    <label for="visitDate">방문날짜 <span>*</span></label>
                                    <input type="date" 
                                           id="visitDate" 
                                           name="visitDate" 
                                           required
                                           min="${visitDateRange.startDate}"
                                           max="${visitDateRange.endDate}"
                                           data-start-date="${visitDateRange.startDate}"
                                           data-end-date="${visitDateRange.endDate}">
                                    <p class="form-help-text date-range-info">${this.formatDateRangeText(visitDateRange)}</p>
                                </div>
                                <div class="form-group full-width">
                                    <label for="visitTime">방문시간 <span>*</span></label>
                                    <select id="visitTime" name="visitTime" required>
                                        <option value="">시간을 선택하세요</option>
                                        <option value="10:00">오전 10:00</option>
                                        <option value="10:30">오전 10:30</option>
                                        <option value="11:00">오전 11:00</option>
                                        <option value="11:30">오전 11:30</option>
                                        <option value="12:00">오후 12:00</option>
                                        <option value="12:30">오후 12:30</option>
                                        <option value="13:00">오후 1:00</option>
                                        <option value="13:30">오후 1:30</option>
                                        <option value="14:00">오후 2:00</option>
                                        <option value="14:30">오후 2:30</option>
                                        <option value="15:00">오후 3:00</option>
                                        <option value="15:30">오후 3:30</option>
                                        <option value="16:00">오후 4:00</option>
                                        <option value="16:30">오후 4:30</option>
                                        <option value="17:00">오후 5:00</option>
                                        <option value="17:30">오후 5:30</option>
                                        <option value="18:00">오후 6:00</option>
                                    </select>
                                    <p class="form-help-text">문자를 전송드립니다(오시는길안내)</p>
                                </div>
                                
                                <!-- 개인정보 동의 -->
                                <div class="privacy-consent">
                                    <input type="checkbox" id="privacy-agree" name="privacy-agree" required>
                                    <label for="privacy-agree" class="privacy-consent-text">
                                        개인정보 수집 및 이용 동의 <span style="color: #e74c3c;">*</span>
                                        <span class="privacy-link" onclick="window.openPrivacyModal && openPrivacyModal()" style="text-decoration: underline; cursor: pointer; color: #666; font-size: 0.85rem; margin-left: 0.5rem;">자세히 보기</span>
                                    </label>
                                </div>
                                
                                <div class="submit-section">
                                    <button type="submit" class="btn-submit">상담 신청하기</button>
                                </div>
                            </form>
                        </div>
                        
                        <!-- 문의 정보 섹션 -->
                        <div class="contact-info-section">
                            <div class="contact-info-grid">
                                <div class="contact-info-item">
                                    <div class="contact-info-icon">📞</div>
                                    <div class="contact-info-title">전화 문의</div>
                                    <div class="contact-info-value">
                                        <a href="tel:${phone.replace(/-/g, '')}">${phone}</a>
                                    </div>
                                </div>
                                <div class="contact-info-item">
                                    <div class="contact-info-icon">🕐</div>
                                    <div class="contact-info-title">운영 시간</div>
                                    <div class="contact-info-value">${hours}</div>
                                </div>
                                ${address ? `
                                    <div class="contact-info-item">
                                        <div class="contact-info-icon">📍</div>
                                        <div class="contact-info-title">모델하우스</div>
                                        <div class="contact-info-value">${address}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 개인정보처리방침 모달 -->
                <div id="privacy-modal" class="privacy-modal">
                    <div class="privacy-modal-content">
                        <div class="privacy-modal-header">
                            <h2 class="privacy-modal-title">개인정보처리방침</h2>
                            <button class="privacy-modal-close" onclick="window.closePrivacyModal && closePrivacyModal()">&times;</button>
                        </div>
                        <div class="privacy-modal-body">
                            ${data.privacyPolicy ? `
                                ${data.privacyPolicy}
                            ` : `
                                <h3>1. 개인정보의 수집 및 이용목적</h3>
                                <p>${projectTitle}은 다음의 목적을 위하여 개인정보를 처리합니다.</p>
                                <ul>
                                    <li>부동산 분양 상담 및 계약</li>
                                    <li>고객 문의사항 답변</li>
                                    <li>분양 정보 안내</li>
                                </ul>
                                
                                <h3>2. 수집하는 개인정보 항목</h3>
                                <ul>
                                    <li>필수항목: 성명, 연락처</li>
                                    <li>선택항목: 관심평형, 문의사항</li>
                                </ul>
                                
                                <h3>3. 개인정보의 보유 및 이용기간</h3>
                                <p>수집된 개인정보는 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
                                <ul>
                                    <li>보존기간: 분양 완료 후 1년</li>
                                    <li>관련 법령에 의한 정보보유 사유에 해당하는 경우 해당 기간 동안 보관</li>
                                </ul>
                                
                                <h3>4. 개인정보의 제3자 제공</h3>
                                <p>원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
                                <ul>
                                    <li>정보주체의 동의가 있는 경우</li>
                                    <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                                </ul>
                                
                                <h3>5. 개인정보의 파기</h3>
                                <p>개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                                
                                <h3>6. 정보주체의 권리</h3>
                                <p>정보주체는 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
                                <ul>
                                    <li>개인정보 열람 요구</li>
                                    <li>오류 등이 있을 경우 정정 요구</li>
                                    <li>삭제 요구</li>
                                    <li>처리정지 요구</li>
                                </ul>
                            `}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderFormField(field) {
        const fullWidthClass = field.fullWidth ? ' full-width' : '';
        
        switch(field.type) {
            case 'text':
            case 'tel':
            case 'email':
                return `
                    <div class="form-group${fullWidthClass}">
                        <label for="${field.name}">${field.label}${field.required ? ' <span>*</span>' : ''}</label>
                        <input type="${field.type}" 
                               id="${field.name}" 
                               name="${field.name}" 
                               ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                               ${field.required ? 'required' : ''}>
                    </div>
                `;
            case 'select':
                return `
                    <div class="form-group${fullWidthClass}">
                        <label for="${field.name}">${field.label}${field.required ? ' <span>*</span>' : ''}</label>
                        <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                            <option value="">선택하세요</option>
                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group${fullWidthClass}">
                        <label for="${field.name}">${field.label}${field.required ? ' <span>*</span>' : ''}</label>
                        <textarea id="${field.name}" 
                                  name="${field.name}" 
                                  ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                  ${field.required ? 'required' : ''}></textarea>
                    </div>
                `;
            default:
                return '';
        }
    }
    
    getFloorplanIcon(type) {
        // 평형별 아이콘 반환
        const iconMap = {
            '84A': '🏠',
            '84B': '🏡',
            '84C': '🏭',
            '99A': '🏪',
            '99B': '🏛️'
        };
        return iconMap[type] || '🏢';
    }

    formatDateRangeText(dateRange) {
        // 날짜 범위를 사용자 친화적으로 표시
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
            return `${year}년 ${month}월 ${day}일(${weekday})`;
        };
        
        return `방문 가능 기간: ${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    }
}