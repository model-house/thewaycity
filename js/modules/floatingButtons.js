// Floating Buttons Module
export class FloatingButtons {
    constructor() {
        this.scrollTopBtn = null;
        this.scrollThreshold = 300;
    }

    init() {
        this.setupScrollTopButton();
        this.setupSmoothScroll();
        this.showScrollTopOnScroll();
    }

    setupScrollTopButton() {
        this.scrollTopBtn = document.querySelector('.floating-btn.scroll-top');
        
        if (!this.scrollTopBtn) return;
        
        this.scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupSmoothScroll() {
        // 방문 예약 버튼 스무스 스크롤
        const reserveBtn = document.querySelector('.floating-btn.btn-register');
        
        if (reserveBtn) {
            reserveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 약간의 지연을 주어 요소 위치를 정확히 계산
                setTimeout(() => {
                    const target = document.querySelector('#contact');
                    
                    if (target) {
                        // getBoundingClientRect를 사용하여 정확한 위치 계산
                        const targetRect = target.getBoundingClientRect();
                        const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const offset = targetRect.top + scrollTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        }
        
        // 헤더의 상담문의 버튼도 동일하게 처리
        const headerRegisterBtn = document.querySelector('.nav-actions .btn-register');
        
        if (headerRegisterBtn && headerRegisterBtn !== reserveBtn) {
            headerRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                setTimeout(() => {
                    const target = document.querySelector('#contact');
                    if (target) {
                        const targetRect = target.getBoundingClientRect();
                        const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const offset = targetRect.top + scrollTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        }
    }

    showScrollTopOnScroll() {
        if (!this.scrollTopBtn) return;
        
        const checkScroll = () => {
            if (window.pageYOffset > this.scrollThreshold) {
                this.scrollTopBtn.classList.add('show');
            } else {
                this.scrollTopBtn.classList.remove('show');
            }
        };
        
        // 초기 체크
        checkScroll();
        
        // 스크롤 이벤트
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}