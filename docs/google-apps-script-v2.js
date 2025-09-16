// Google Apps Script 코드 (Google Sheets에서 실행)
// CORS 문제 해결을 위한 개선된 버전

// GET 요청 처리 (CORS 테스트용)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'GET request received'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST 요청 처리
function doPost(e) {
  try {
    // 스프레드시트 ID (URL에서 확인)
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Content Type 확인
    let data;
    if (e.postData && e.postData.contents) {
      // JSON 데이터 파싱
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // JSON 파싱 실패시 파라미터에서 데이터 가져오기
        data = e.parameter;
      }
    } else {
      // Form data로 전송된 경우
      data = e.parameter;
    }
    
    // Honeypot 체크 (봇 방지)
    if (data.website && data.website !== '') {
      console.log('Bot detected - honeypot filled');
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', message: 'Invalid request'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 기본 유효성 검사
    if (!data.name || data.name.length < 2) {
      throw new Error('이름이 잘못되었습니다.');
    }
    
    // 전화번호 형식 검사
    const phoneRegex = /^(01[0-9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      throw new Error('전화번호 형식이 잘못되었습니다.');
    }
    
    // 현재 시간 (한국 시간)
    const kstTime = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    
    // 새 행 추가
    sheet.appendRow([
      kstTime,
      data.name || '',
      data.phone || '',
      data.visitors || '',
      data.visitDate || '',
      data.message || '',
      data.privacy || '',
      data.referrer || '',
      data.userAgent || ''
    ]);
    
    // 이메일 알림 (선택사항)
    // sendEmailNotification(data);
    
    // 성공 응답 (CORS 헤더 포함)
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '상담 신청이 접수되었습니다.',
        timestamp: kstTime
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // 에러 로깅
    console.error('Error in doPost:', error);
    
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 이메일 알림 함수 (선택사항)
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com'; // 알림 받을 이메일
  const subject = '새로운 상담 신청';
  
  const body = `
새로운 상담 신청이 접수되었습니다.

이름: ${data.name}
연락처: ${data.phone}
방문인원: ${data.visitors}
방문날짜: ${data.visitDate}
문의사항: ${data.message}

Google Sheets에서 확인하세요.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// 헤더 설정 (최초 1회 실행)
function setupSheet() {
  const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  const headers = [
    '제출시간',
    '이름',
    '연락처',
    '방문인원',
    '방문날짜',
    '문의사항',
    '개인정보동의',
    '유입경로',
    'User Agent'
  ];
  
  // 첫 행에 헤더 설정
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // 헤더 스타일 설정
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a5490')
    .setFontColor('#ffffff');
  
  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
}

// 테스트 함수
function testPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: '테스트',
        phone: '010-1234-5678',
        visitors: '2',
        visitDate: '2024-12-18',
        message: '테스트 메시지',
        privacy: 'Y',
        referrer: 'Direct',
        userAgent: 'Test Browser'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}
