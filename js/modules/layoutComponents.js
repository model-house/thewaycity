// Layout Components Module - 네비게이션, 푸터 등 공통 레이아웃
export class LayoutComponents {
    constructor() {
        this.data = null;
    }

    setData(data) {
        this.data = data;
    }

    renderHeader(data = null) {
        const siteData = data || this.data;
        const siteTitle = siteData?.site?.title || '김포 오퍼스 한강 스위첸';
        const phone = siteData?.site?.contact?.phone || '1811-0000';
        
        return `
            <header id="header" class="header">
                <nav class="nav-container">
                    <div class="logo">
                        <h1 id="site-title">${siteTitle}</h1>
                    </div>
                    <ul class="nav-menu">
                        <li><a href="#overview">사업개요</a></li>
                        <li><a href="#design">브랜드</a></li>
                        <li><a href="#location">입지환경</a></li>
                        <li><a href="#layout">배치도</a></li>
                        <li><a href="#floorplans">평면도</a></li>
                        <li><a href="#premium">프리미엄</a></li>
                        <li><a href="#convenience">편의시설</a></li>
                        <li><a href="#community">커뮤니티</a></li>
                        <li><a href="#contact">상담문의</a></li>
                    </ul>
                    <div class="nav-actions">
                        <a href="tel:${phone}" class="btn-tel">📞 전화문의</a>
                        <a href="#contact" class="btn-register">관심고객 등록</a>
                    </div>
                    <button class="mobile-menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </header>
        `;
    }

    renderFooter(data = null) {
        const siteData = data || this.data;
        
        // site.footer를 우선 사용, 없으면 기존 footer 데이터 사용 (하위 호환성)
        const footerData = siteData?.site?.footer || siteData?.footer || {};
        
        // 프로젝트 정보 - site에서 가져오거나 footer에서 가져오기
        const projectName = siteData?.site?.title || footerData.projectInfo?.projectName || '김포 오퍼스 한강 스위첸';
        const manager = footerData.manager || footerData.projectInfo?.manager || '';
        const description = footerData.description || footerData.projectInfo?.description || '';
        const address = siteData?.site?.contact?.address || footerData.projectInfo?.address || '경기도 김포시 장기동 일원';
        
        // 회사 정보 - site.footer를 우선 사용
        const developer = footerData.developer || footerData.companies?.developer || '';
        const constructor = footerData.constructor || footerData.companies?.constructor || '';
        const trustee = footerData.trustee || footerData.companies?.trustee || '';
        
        // 경고 문구와 추가 주석
        const disclaimers = footerData.disclaimers || [];
        const additionalNote = footerData.additionalNote || '';
        
        const year = new Date().getFullYear();
        
        return `
            <footer id="footer" class="footer">
                <div class="footer-container">
                    <!-- 프로젝트 정보 -->
                    <div class="footer-project-info">
                        <div class="project-header">
                            <h3 class="project-name">${projectName}</h3>
                            ${manager ? `<p class="project-manager">담당자 │ ${manager}</p>` : ''}
                        </div>
                        ${description ? `<p class="project-description">${description}</p>` : ''}
                        ${address ? `<p class="project-address">${address}</p>` : ''}
                    </div>
                    
                    <!-- 경고문구 -->
                    ${disclaimers.length > 0 ? `
                        <div class="footer-disclaimers">
                            ${disclaimers.map(text => `<p class="disclaimer-text">· ${text}</p>`).join('')}
                        </div>
                    ` : ''}
                    
                    <!-- 회사 정보 -->
                    ${(developer || constructor || trustee) ? `
                        <div class="footer-companies">
                            ${developer ? `
                                <div class="company-item">
                                    <span class="company-label">시행사</span>
                                    <span class="company-name">${developer}</span>
                                </div>
                            ` : ''}
                            ${constructor ? `
                                <div class="company-item">
                                    <span class="company-label">시공사</span>
                                    <span class="company-name">${constructor}</span>
                                </div>
                            ` : ''}
                            ${trustee ? `
                                <div class="company-item">
                                    <span class="company-label">신탁사</span>
                                    <span class="company-name">${trustee}</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    <!-- 추가 주석 -->
                    ${additionalNote ? `
                        <div class="footer-note">
                            <p>${additionalNote}</p>
                        </div>
                    ` : ''}
                    
                    <!-- 카피라이트 -->
                    <div class="footer-copyright">
                        <p>© ${year} ${projectName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    renderFloatingButtons(data = null) {
        const siteData = data || this.data;
        const phone = siteData?.site?.contact?.phone || siteData?.contact?.phone || '1811-0000';
        
        // 카카오톡 링크 우선순위: site.contact.kakao > footer.contacts.kakao > contact.kakao > 기본값
        const kakao = siteData?.site?.contact?.kakao || 
                      siteData?.footer?.contacts?.kakao || 
                      siteData?.contact?.kakao || 
                      'http://pf.kakao.com/_xexaxaK';
        
        // 빈 문자열인 경우 기본값 사용
        const kakaoLink = kakao && kakao.trim() !== '' ? kakao : 'http://pf.kakao.com/_xexaxaK';
        
        // 카카오톡 버튼 활성화 상태 확인 (기본값: true)
        const kakaoEnabled = siteData?.site?.contact?.kakaoEnabled !== false;
        
        // 디버깅을 위한 콘솔 출력
        console.log('카카오톡 링크 디버깅:', {
            'site.contact.kakao': siteData?.site?.contact?.kakao,
            'site.contact.kakaoEnabled': siteData?.site?.contact?.kakaoEnabled,
            'footer.contacts.kakao': siteData?.footer?.contacts?.kakao,
            'contact.kakao': siteData?.contact?.kakao,
            '카카오톡 활성화': kakaoEnabled,
            '최종 선택된 링크': kakaoLink
        });
        
        return `
            <div class="floating-buttons">
                <a href="tel:${phone}" class="floating-btn btn-tel" data-tooltip="전화 문의">
                    <span class="btn-text">전화 문의</span>
                </a>
                <a href="#contact" class="floating-btn btn-register" data-tooltip="방문 예약">
                    <span class="btn-text">방문 예약</span>
                </a>
                ${kakaoEnabled ? `
                    <a href="${kakaoLink}" target="_blank" class="floating-btn btn-kakao" data-tooltip="카톡 상담">
                        <span class="btn-text">카톡 상담</span>
                    </a>
                ` : ''}
                <button class="floating-btn scroll-top" data-tooltip="위로 가기">
                    <span class="btn-text">위로 가기</span>
                </button>
            </div>
        `;
    }

    renderLoadingSpinner() {
        return `
            <div id="loading" class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }

    // 전체 페이지 레이아웃 렌더링
    renderPageLayout(content, data = null) {
        return `
            ${this.renderHeader(data)}
            <main id="main-content">
                ${content}
            </main>
            ${this.renderFooter(data)}
            ${this.renderFloatingButtons(data)}
            ${this.renderLoadingSpinner()}
        `;
    }

    // DOM에 직접 삽입하는 메서드
    injectHeader(targetSelector = 'body', position = 'afterbegin') {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.insertAdjacentHTML(position, this.renderHeader());
        }
    }

    injectFooter(targetSelector = 'body', position = 'beforeend') {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.insertAdjacentHTML(position, this.renderFooter());
        }
    }

    injectFloatingButtons(targetSelector = 'body', position = 'beforeend') {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.insertAdjacentHTML(position, this.renderFloatingButtons());
        }
    }

    // 전체 레이아웃 한번에 삽입
    injectFullLayout(targetSelector = 'body') {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        // 기존 body 내용을 main으로 감싸기
        const existingContent = target.innerHTML;
        
        target.innerHTML = '';
        target.insertAdjacentHTML('afterbegin', this.renderHeader());
        target.insertAdjacentHTML('beforeend', `<main id="main-content">${existingContent}</main>`);
        target.insertAdjacentHTML('beforeend', this.renderFooter());
        target.insertAdjacentHTML('beforeend', this.renderFloatingButtons());
        target.insertAdjacentHTML('beforeend', this.renderLoadingSpinner());
    }
}