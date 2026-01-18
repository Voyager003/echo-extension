# Echo - AI 기반 학습 피드백 익스텐션

웹 페이지의 콘텐츠를 분석하고, AI를 활용하여 학습 피드백을 제공하는 Chrome 익스텐션입니다.

## 기능

- 웹 페이지 텍스트 자동 추출
- Gemini AI를 활용한 콘텐츠 분석
- 학습 내용 회상 비교 및 피드백
- 심화 질문 답변 기능

## 설치 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 빌드

```bash
npm run build
```

### 3. Chrome에 익스텐션 로드

1. Chrome 브라우저에서 `chrome://extensions` 열기
2. 우측 상단의 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

## API 키 설정

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 Gemini API 키 발급
2. 익스텐션 아이콘 우클릭 → 옵션
3. API 키 입력 후 저장

## 사용법

1. 학습하고 싶은 웹 페이지로 이동
2. 익스텐션 아이콘 클릭하여 사이드 패널 열기
3. "콘텐츠 분석" 버튼 클릭
4. AI가 제공하는 분석 결과 확인
5. 회상 테스트 및 심화 학습 진행

## 개발

개발 모드로 실행 (파일 변경 시 자동 빌드):

```bash
npm run dev
```

## 기술 스택

- TypeScript
- React
- Tailwind CSS
- Webpack
- Gemini API (gemini-2.5-flash-lite)
