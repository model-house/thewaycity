// Form Handler Module with Google Sheets Integration
export class FormHandler {
    constructor() {
        this.forms = [];
        // Google Apps Script Web App URL (v6 - IP 제거, 간소화)
        this.googleSheetURL = 'https://script.google.com/macros/s/AKfycbx9vHxqM04FRIenGXueFSSdnYdRc75VSwupAS2uyrzaEDUpYyeRf8-wyhucpBzmhA1TcA/exec';
    }

    init() {
        this.setupContactForm();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Honeypot field 추가 (봇 방지)
        this.addHoneypotField(contactForm);
        
        // Rate limiting 초기화
        this.initRateLimiting();

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Rate limiting 체크
            if (!this.checkRateLimit()) {
                this.showErrorMessage(contactForm, '잠시 후 다시 시도해주세요. (10분당 3회까지 가능)');
                return;
            }
            
            // Honeypot 체크
            if (this.isBot(contactForm)) {
                console.warn('Bot detected');
                return;
            }
            
            // 기본 유효성 검사
            if (!this.validateForm(contactForm)) {
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // 버튼 비활성화 및 로딩 표시
                submitBtn.disabled = true;
                submitBtn.textContent = '전송 중...';
                
                // 폼 데이터 수집
                const formData = new FormData(contactForm);
                
                // 날짜와 시간 결합
                const visitDate = formData.get('visitDate');
                const visitTime = formData.get('visitTime');
                let visitDateTime = '';
                
                if (visitDate && visitTime) {
                    visitDateTime = `${visitDate} ${visitTime}`;
                } else if (visitDate) {
                    visitDateTime = visitDate;
                }
                
                const data = {
                    timestamp: new Date().toLocaleString('ko-KR'),
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    visitors: formData.get('visitors'),
                    visitDate: visitDateTime,
                    privacy: formData.get('privacy-agree') ? 'Y' : 'N',
                    referrer: document.referrer || window.location.href,
                    siteName: window.siteData?.site?.title || '김포 오퍼스 한강 스위친'
                };
                
                // 구글 시트에 데이터 전송
                if (this.googleSheetURL && this.googleSheetURL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                    console.log('Sending to Google Sheets:', data);
                    await this.sendToGoogleSheet(data);
                }
                
                // 로컬 저장 (백업)
                this.saveToLocalStorage(data);
                
                // 성공 메시지
                this.showSuccessMessage(contactForm);
                
                // Rate limit 업데이트 (성공 시에만)
                this.updateRateLimit(data.phone);
                
                // 폼 초기화
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showErrorMessage(contactForm);
            } finally {
                // 버튼 복원
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    async sendToGoogleSheet(data) {
        try {
            // 방법 1: fetch with no-cors (CORS 우회)
            const response = await fetch(this.googleSheetURL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script는 CORS를 지원하지 않음
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // no-cors 모드에서는 response를 읽을 수 없음
            console.log('Data sent to Google Sheets');
            
            // 방법 2: 대체 - iframe을 통한 전송 (필요시)
            // this.sendViaIframe(data);
            
        } catch (error) {
            console.error('Google Sheets error:', error);
            // 에러가 발생해도 사용자에게는 성공으로 표시 (로컬 저장은 성공)
            // throw error;
        }
    }
    
    // 대체 방법: iframe을 통한 전송
    sendViaIframe(data) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.googleSheetURL;
        
        // 데이터를 form field로 변환
        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        });
        
        iframe.contentDocument.body.appendChild(form);
        form.submit();
        
        // iframe 제거
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 2000);
    }

    saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(data);
            
            // 최근 100개만 보관
            if (submissions.length > 100) {
                submissions.shift();
            }
            
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        } catch (error) {
            console.error('LocalStorage error:', error);
        }
    }

    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">✅</span>
                <div>
                    <h4>상담 신청이 완료되었습니다!</h4>
                    <p>빠른 시일 내에 연락드리겠습니다.</p>
                </div>
            </div>
        `;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(form, customMessage = null) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">❌</span>
                <div>
                    <h4>${customMessage ? '' : '전송 중 오류가 발생했습니다.'}</h4>
                    <p>${customMessage || '잠시 후 다시 시도해주세요.'}</p>
                </div>
            </div>
        `;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    // Honeypot field 추가 (봇 방지)
    addHoneypotField(form) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.id = 'website';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        honeypot.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
        honeypot.setAttribute('aria-hidden', 'true');
        
        const label = document.createElement('label');
        label.htmlFor = 'website';
        label.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
        label.setAttribute('aria-hidden', 'true');
        label.textContent = 'Website (Leave empty)';
        
        form.appendChild(label);
        form.appendChild(honeypot);
    }
    
    // Bot 검사
    isBot(form) {
        const honeypot = form.querySelector('#website');
        return honeypot && honeypot.value !== '';
    }
    
    // Rate Limiting
    initRateLimiting() {
        this.submissionTimes = JSON.parse(localStorage.getItem('submissionTimes') || '[]');
        this.phoneSubmissions = JSON.parse(localStorage.getItem('phoneSubmissions') || '{}');
        this.maxSubmissions = 3; // 10분당 최대 3회
        this.timeWindow = 10 * 60 * 1000; // 10분
    }
    
    checkRateLimit() {
        const now = Date.now();
        const phone = document.querySelector('#phone')?.value.trim();
        
        // 전체 제출 횟수 체크
        const recentSubmissions = this.submissionTimes.filter(time => now - time < this.timeWindow);
        
        if (recentSubmissions.length >= this.maxSubmissions) {
            console.log('Rate limit exceeded: too many submissions');
            return false;
        }
        
        // 전화번호별 제출 체크
        if (phone && this.phoneSubmissions[phone]) {
            const lastSubmitTime = this.phoneSubmissions[phone];
            if (now - lastSubmitTime < this.timeWindow) {
                const remainingMinutes = Math.ceil((this.timeWindow - (now - lastSubmitTime)) / 60000);
                this.showErrorMessage(document.getElementById('contactForm'), 
                    `해당 연락처로 이미 상담 신청이 접수되었습니다. ${remainingMinutes}분 후 다시 시도해주세요.`);
                return false;
            }
        }
        
        return true;
    }
    
    updateRateLimit(phone) {
        const now = Date.now();
        
        // 전체 제출 시간 기록
        this.submissionTimes.push(now);
        this.submissionTimes = this.submissionTimes.filter(time => now - time < this.timeWindow);
        localStorage.setItem('submissionTimes', JSON.stringify(this.submissionTimes));
        
        // 전화번호별 제출 시간 기록
        if (phone) {
            this.phoneSubmissions[phone] = now;
            localStorage.setItem('phoneSubmissions', JSON.stringify(this.phoneSubmissions));
        }
    }
    
    // 폼 유효성 검사
    validateForm(form) {
        const name = form.querySelector('#name')?.value.trim();
        const phone = form.querySelector('#phone')?.value.trim();
        const privacy = form.querySelector('#privacy-agree')?.checked;
        
        // 이름 검사
        if (!name || name.length < 2) {
            this.showErrorMessage(form, '이름을 2자 이상 입력해주세요.');
            return false;
        }
        
        // 전화번호 형식 검사
        const phoneRegex = /^(01[0-9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phone || !phoneRegex.test(phone)) {
            this.showErrorMessage(form, '올바른 휴대폰 번호를 입력해주세요.');
            return false;
        }
        
        // 개인정보 동의
        if (!privacy) {
            this.showErrorMessage(form, '개인정보 수집 및 이용에 동의해주세요.');
            return false;
        }
        
        return true;
    }

    // 관리자용 - 로컬 저장 데이터 확인
    getSubmissions() {
        try {
            return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        } catch (error) {
            return [];
        }
    }

    // 관리자용 - 데이터 내보내기
    exportToCSV() {
        const submissions = this.getSubmissions();
        if (submissions.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }
        
        // CSV 헤더
        const headers = ['시간', '이름', '연락처', '방문인원', '방문날짜', '문의사항', '개인정보동의', '유입경로'];
        const csv = [
            headers.join(','),
            ...submissions.map(row => [
                row.timestamp,
                row.name,
                row.phone,
                row.visitors,
                row.visitDate,
                `"${row.message || ''}"`,
                row.privacy,
                row.referrer
            ].join(','))
        ].join('\n');
        
        // 다운로드
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `상담신청_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
