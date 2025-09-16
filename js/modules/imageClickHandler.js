// Image Click Handler Module - 모바일 및 PC에서 이미지 클릭 처리
export class ImageClickHandler {
    constructor() {
        this.imageSelectors = [
            '.location-image-container',
            '.community-main-display',
            '.community-sub-display',
            '.premium-image-item',
            '#main-floorplan-image',
            '.gallery-main img'
        ];
        this.isScrolling = false;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        // 스타일 추가
        this.addStyles();
        
        // DOM이 완전히 로드된 후에 실행
        if (this.isMobile) {
            // 모바일에서는 확대 버튼 추가
            this.setupMobileImageHandlers();
            
            // 동적으로 추가되는 이미지를 위한 MutationObserver
            this.observeDynamicImages();
        } else {
            // PC에서는 기존 클릭 방식 유지
            this.setupImageClickHandlers();
        }
        
        // 동적으로 추가되는 이미지를 위한 이벤트 위임
        this.setupDelegatedHandlers();
    }

    setupImageClickHandlers() {
        // 모든 이미지 선택자에 대해 이벤트 리스너 추가
        this.imageSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 기존 onclick 속성 제거
                element.removeAttribute('onclick');
                
                // 이미지 소스 찾기
                let imgSrc = '';
                if (element.tagName === 'IMG') {
                    imgSrc = element.src;
                } else {
                    const img = element.querySelector('img');
                    if (img) {
                        imgSrc = img.src;
                    }
                }
                
                if (imgSrc) {
                    // 터치 이벤트와 클릭 이벤트 모두 처리
                    element.style.cursor = 'pointer';
                    
                    // 클릭 이벤트
                    element.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.openImage(imgSrc);
                    });
                    
                    // 터치 이벤트 (모바일) - passive: true로 변경하여 스크롤 허용
                    element.addEventListener('touchend', (e) => {
                        // 스크롤 중이라면 무시
                        if (this.isScrolling) {
                            this.isScrolling = false;
                            return;
                        }
                        this.openImage(imgSrc);
                    });
                    
                    // 스크롤 감지
                    let touchStartY = 0;
                    element.addEventListener('touchstart', (e) => {
                        touchStartY = e.touches[0].clientY;
                    });
                    
                    element.addEventListener('touchmove', (e) => {
                        const touchMoveY = e.touches[0].clientY;
                        if (Math.abs(touchMoveY - touchStartY) > 10) {
                            this.isScrolling = true;
                        }
                    });
                }
            });
        });
    }

    setupDelegatedHandlers() {
        if (this.isMobile) {
            // 모바일에서는 클릭 이벤트 비활성화
            return;
        }
        
        // PC에서만 동적 클릭 핸들러 설정
        document.body.addEventListener('click', (e) => {
            // 클릭된 요소가 이미지 컨테이너인지 확인
            const clickableContainer = e.target.closest('.location-image-container, .community-main-display, .community-sub-display, .premium-image-item, .gallery-main');
            
            if (clickableContainer) {
                e.preventDefault();
                e.stopPropagation();
                
                const img = clickableContainer.querySelector('img');
                if (img && img.src) {
                    this.openImage(img.src);
                }
            }
        });
    }

    openImage(imageSrc) {
        if (!imageSrc) return;
        
        // ImageViewer가 있으면 사용, 없으면 기본 방식 사용
        if (window.openImageViewer) {
            window.openImageViewer(imageSrc);
        } else if (window.openImageOverlay) {
            window.openImageOverlay(imageSrc);
        } else {
            // 폴백: 새 창으로 이미지 열기
            window.open(imageSrc, '_blank');
        }
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .image-zoom-wrapper {
                position: relative;
                display: inline-block;
                width: 100%;
            }
            
            .image-zoom-button {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .image-zoom-button:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: scale(1.05);
            }
            
            .image-zoom-button svg {
                width: 16px;
                height: 16px;
            }
            
            /* 모바일에서는 이미지 클릭 비활성화 */
            @media (max-width: 768px) {
                .location-image-container,
                .community-main-display,
                .community-sub-display,
                .premium-image-item,
                #main-floorplan-image,
                .gallery-main img {
                    cursor: default !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupMobileImageHandlers() {
        // 모든 이미지 선택자에 대해 확대 버튼 추가
        this.imageSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 기존 onclick 속성 제거
                element.removeAttribute('onclick');
                
                // 이미지 소스 찾기
                let imgSrc = '';
                let imgElement = null;
                
                if (element.tagName === 'IMG') {
                    imgSrc = element.src;
                    imgElement = element;
                } else {
                    const img = element.querySelector('img');
                    if (img) {
                        imgSrc = img.src;
                        imgElement = img;
                    }
                }
                
                if (imgSrc && imgElement) {
                    // 이미지를 감싸는 wrapper 생성
                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-zoom-wrapper';
                    
                    // 부모 요소의 스타일 복사
                    const parent = imgElement.parentElement;
                    const computedStyle = window.getComputedStyle(parent);
                    if (computedStyle.display === 'flex' || computedStyle.display === 'grid') {
                        wrapper.style.width = '100%';
                        wrapper.style.height = '100%';
                    }
                    
                    // 이미지를 wrapper로 감싸기
                    parent.insertBefore(wrapper, imgElement);
                    wrapper.appendChild(imgElement);
                    
                    // 확대 버튼 추가
                    const button = document.createElement('button');
                    button.className = 'image-zoom-button';
                    button.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                            <path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="2"/>
                            <path d="M15.5 15.5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>확대하기</span>
                    `;
                    
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.openImage(imgSrc);
                    });
                    
                    wrapper.appendChild(button);
                    
                    // 이미지 자체의 클릭 이벤트 제거
                    imgElement.style.cursor = 'default';
                    imgElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            });
        });
    }
    
    observeDynamicImages() {
        // MutationObserver를 사용하여 동적으로 추가되는 이미지 감시
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // 추가된 노드가 이미지 컨테이너인지 확인
                        this.imageSelectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.addZoomButtonToElement(node);
                            }
                            // 하위 요소도 확인
                            const elements = node.querySelectorAll ? node.querySelectorAll(selector) : [];
                            elements.forEach(element => {
                                this.addZoomButtonToElement(element);
                            });
                        });
                    }
                });
            });
        });
        
        // 모든 섹션 감시
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    addZoomButtonToElement(element) {
        // 이미 버튼이 추가되어 있는지 확인
        if (element.parentElement && element.parentElement.classList.contains('image-zoom-wrapper')) {
            return;
        }
        
        // 기존 onclick 속성 제거
        element.removeAttribute('onclick');
        
        // 이미지 소스 찾기
        let imgSrc = '';
        let imgElement = null;
        
        if (element.tagName === 'IMG') {
            imgSrc = element.src;
            imgElement = element;
        } else {
            const img = element.querySelector('img');
            if (img) {
                imgSrc = img.src;
                imgElement = img;
            }
        }
        
        if (imgSrc && imgElement) {
            // 이미지를 감싸는 wrapper 생성
            const wrapper = document.createElement('div');
            wrapper.className = 'image-zoom-wrapper';
            
            // 부모 요소의 스타일 복사
            const parent = imgElement.parentElement;
            const computedStyle = window.getComputedStyle(parent);
            if (computedStyle.display === 'flex' || computedStyle.display === 'grid') {
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
            }
            
            // 이미지를 wrapper로 감싸기
            parent.insertBefore(wrapper, imgElement);
            wrapper.appendChild(imgElement);
            
            // 확대 버튼 추가
            const button = document.createElement('button');
            button.className = 'image-zoom-button';
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="2"/>
                    <path d="M15.5 15.5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>확대하기</span>
            `;
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openImage(imgSrc);
            });
            
            wrapper.appendChild(button);
            
            // 이미지 자체의 클릭 이벤트 제거
            imgElement.style.cursor = 'default';
            imgElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    }
}

// 전역 인스턴스 생성
const imageClickHandler = new ImageClickHandler();

export default imageClickHandler;