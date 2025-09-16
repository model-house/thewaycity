// Image Viewer Module - 이미지 확대/축소 및 이동 기능
export class ImageViewer {
    constructor() {
        this.overlay = null;
        this.image = null;
        this.scale = 1;
        this.minScale = 1;
        this.maxScale = 5;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        
        // 핀치 줌 관련 속성
        this.initialPinchDistance = 0;
        this.isPinching = false;
    }

    init() {
        this.createOverlay();
        this.setupEventListeners();
    }

    createOverlay() {
        // 오버레이 생성
        this.overlay = document.createElement('div');
        this.overlay.className = 'image-viewer-overlay';
        this.overlay.innerHTML = `
            <div class="image-viewer-container">
                <img class="viewer-image" alt="확대 이미지">
                <div class="viewer-controls">
                    <button class="viewer-btn zoom-in" title="확대">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                            <path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="2"/>
                            <path d="M15.5 15.5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="viewer-btn zoom-out" title="축소">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                            <path d="M7 10h6" stroke="currentColor" stroke-width="2"/>
                            <path d="M15.5 15.5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="viewer-btn reset" title="원본 크기">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="5" y="5" width="14" height="14" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        </svg>
                    </button>
                    <button class="viewer-btn close" title="닫기">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="viewer-info">
                    <span class="zoom-level">100%</span>
                    <span class="viewer-hint desktop-hint">마우스 휠: 확대/축소 | 드래그: 이동 | ESC: 닫기</span>
                    <span class="viewer-hint mobile-hint">핀치: 확대/축소 | 드래그: 이동</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        this.image = this.overlay.querySelector('.viewer-image');
        this.container = this.overlay.querySelector('.image-viewer-container');
        
        // 스타일 추가
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .image-viewer-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                cursor: grab;
            }
            
            .image-viewer-overlay.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .image-viewer-overlay.dragging {
                cursor: grabbing;
            }
            
            .image-viewer-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .viewer-image {
                max-width: 90%;
                max-height: 90%;
                transform-origin: center;
                transition: transform 0.1s ease-out;
                user-select: none;
                -webkit-user-drag: none;
            }
            
            .viewer-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            
            .viewer-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation; /* 더블 탭 방지 */
                user-select: none;
            }
            
            .viewer-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .viewer-btn:active {
                transform: scale(0.95);
                background: rgba(255, 255, 255, 0.3);
            }
            
            .viewer-info {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 20px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 20px;
                color: white;
                font-size: 14px;
                backdrop-filter: blur(10px);
            }
            
            .zoom-level {
                font-weight: bold;
                min-width: 60px;
                text-align: center;
            }
            
            .viewer-hint {
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
            }
            
            .desktop-hint {
                display: block;
            }
            
            .mobile-hint {
                display: none;
            }
            
            @media (max-width: 768px) {
            .viewer-controls {
            top: 10px;
            right: 10px;
            gap: 8px;
            padding: 8px;
                background: rgba(0, 0, 0, 0.8);
                }
                
                .viewer-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                    background: rgba(255, 255, 255, 0.15);
                }
                
                .viewer-btn:active {
                    background: rgba(255, 255, 255, 0.4);
                }
                
                .viewer-info {
                    bottom: 10px;
                    padding: 8px 15px;
                    font-size: 12px;
                }
                
                .desktop-hint {
                    display: none;
                }
                
                .mobile-hint {
                    display: block;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // 컨트롤 버튼들 - 클릭과 터치 이벤트 모두 처리
        const zoomInBtn = this.overlay.querySelector('.zoom-in');
        const zoomOutBtn = this.overlay.querySelector('.zoom-out');
        const resetBtn = this.overlay.querySelector('.reset');
        const closeBtn = this.overlay.querySelector('.close');
        
        // 확대 버튼
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.zoomIn();
            });
            zoomInBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomIn();
            }, { passive: false });
        }
        
        // 축소 버튼
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.zoomOut();
            });
            zoomOutBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.zoomOut();
            }, { passive: false });
        }
        
        // 리셋 버튼
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.reset();
            });
            resetBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.reset();
            }, { passive: false });
        }
        
        // 닫기 버튼
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            }, { passive: false });
        }
        
        // 오버레이 클릭으로 닫기
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay || e.target === this.container) {
                this.close();
            }
        });
        
        // 모바일에서 오버레이 터치로 닫기
        this.overlay.addEventListener('touchend', (e) => {
            if (e.target === this.overlay || e.target === this.container) {
                // 드래그나 핀치가 아닌 경우에만 닫기
                if (!this.isDragging && !this.isPinching) {
                    e.preventDefault();
                    this.close();
                }
            }
        }, { passive: false });
        
        // 마우스 휠 이벤트 - passive: false로 설정
        this.overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoom(delta, e.clientX, e.clientY);
        }, { passive: false });
        
        // 드래그 이벤트
        this.image.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // 터치 이벤트 (모바일) - passive: false로 설정하여 preventDefault 허용
        this.image.addEventListener('touchstart', this.startTouch.bind(this), { passive: false });
        
        // 이미지 뷰어가 열려있을 때만 touchmove 이벤트 처리
        this.touchMoveHandler = this.touchMove.bind(this);
        this.touchEndHandler = this.endTouch.bind(this);
        
        // 이벤트 핸들러는 open() 메서드에서 추가됨
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(imageSrc) {
        this.image.src = imageSrc;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.reset();
        
        // 이미지 뷰어가 열릴 때 터치 이벤트 추가
        document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this.touchEndHandler, { passive: false });
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
        
        // 이미지 뷰어가 닫힐 때 터치 이벤트 제거
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('touchend', this.touchEndHandler);
    }

    zoomIn() {
        this.zoom(0.2);
    }

    zoomOut() {
        this.zoom(-0.2);
    }

    zoom(delta, centerX = null, centerY = null) {
        const newScale = Math.min(Math.max(this.scale + delta, this.minScale), this.maxScale);
        
        if (newScale === this.scale) return;
        
        // 마우스 위치를 중심으로 확대/축소
        if (centerX && centerY) {
            const rect = this.image.getBoundingClientRect();
            const x = centerX - rect.left - rect.width / 2;
            const y = centerY - rect.top - rect.height / 2;
            
            const scaleDiff = newScale - this.scale;
            this.translateX -= x * scaleDiff;
            this.translateY -= y * scaleDiff;
        }
        
        this.scale = newScale;
        this.updateTransform();
    }

    reset() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    startDrag(e) {
        if (this.scale <= 1) return;
        
        e.preventDefault();
        this.isDragging = true;
        this.overlay.classList.add('dragging');
        this.startX = e.clientX - this.translateX;
        this.startY = e.clientY - this.translateY;
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.translateX = e.clientX - this.startX;
        this.translateY = e.clientY - this.startY;
        this.updateTransform();
    }

    endDrag() {
        this.isDragging = false;
        this.overlay.classList.remove('dragging');
    }

    // 터치 이벤트 핸들러
    startTouch(e) {
        // passive: false로 설정했으므로 preventDefault 사용 가능
        e.preventDefault();
        e.stopPropagation();
        
        // 버튼을 터치한 경우 무시
        if (e.target.closest('.viewer-controls')) {
            return;
        }
        
        // 두 손가락 터치 (핀치 줌)
        if (e.touches.length === 2) {
            this.isPinching = true;
            this.initialPinchDistance = this.getPinchDistance(e.touches);
        } 
        // 한 손가락 터치 (드래그)
        else if (e.touches.length === 1 && this.scale > 1) {
            const touch = e.touches[0];
            this.isDragging = true;
            this.startX = touch.clientX - this.translateX;
            this.startY = touch.clientY - this.translateY;
        }
    }

    touchMove(e) {
        // passive: false로 설정했으므로 preventDefault 사용 가능
        e.preventDefault();
        e.stopPropagation();
        
        // 핀치 줌
        if (this.isPinching && e.touches.length === 2) {
            const currentDistance = this.getPinchDistance(e.touches);
            const scale = currentDistance / this.initialPinchDistance;
            
            // 현재 스케일에 상대적인 변화 적용 (민감도 조정)
            const scaleFactor = 1 + (scale - 1) * 0.5; // 50%로 민감도 감소
            const newScale = Math.min(Math.max(this.scale * scaleFactor, this.minScale), this.maxScale);
            
            if (Math.abs(newScale - this.scale) > 0.01) { // 미세한 변화는 무시
                // 두 손가락 중점을 기준으로 확대/축소
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                
                const rect = this.image.getBoundingClientRect();
                const x = centerX - rect.left - rect.width / 2;
                const y = centerY - rect.top - rect.height / 2;
                
                const scaleDiff = newScale - this.scale;
                this.translateX -= x * scaleDiff;
                this.translateY -= y * scaleDiff;
                
                this.scale = newScale;
                this.initialPinchDistance = currentDistance;
                this.updateTransform();
            }
        }
        // 드래그
        else if (this.isDragging && e.touches.length === 1) {
            const touch = e.touches[0];
            this.translateX = touch.clientX - this.startX;
            this.translateY = touch.clientY - this.startY;
            this.updateTransform();
        }
    }

    endTouch(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.isDragging = false;
        this.isPinching = false;
        this.initialPinchDistance = 0;
    }
    
    // 두 터치 포인트 사이의 거리 계산
    getPinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateTransform() {
        this.image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        
        // 줌 레벨 표시 업데이트
        const zoomLevel = Math.round(this.scale * 100);
        this.overlay.querySelector('.zoom-level').textContent = `${zoomLevel}%`;
    }
}

// 전역 인스턴스 생성
const imageViewer = new ImageViewer();
imageViewer.init();

// 전역 함수로 내보내기
window.openImageViewer = (imageSrc) => {
    imageViewer.open(imageSrc);
};

export default imageViewer;
