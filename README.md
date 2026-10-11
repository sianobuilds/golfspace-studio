# GolfSpace Studio

### Interactive Golf Simulator Space Planning Platform

**GolfSpace Studio**는 스크린골프 시설 구축을 위한 웹 기반 장비 관리 및 2D 공간 설계 플랫폼입니다.

스크린, 런치 모니터, 타석 매트, 프로젝터 등 주요 장비를 탐색하고, 인터랙티브 캔버스에 배치하여 공간 구성을 검토할 수 있습니다. 장비 선정부터 배치 설계, 예상 비용 확인, 설계 데이터 내보내기까지 하나의 웹 환경에서 수행하도록 개발하였습니다.

> Project Type: B2B Web Application / Interactive Design Tool  
> Development Period: January – April 2025  
> Role: Full-Stack Development, UI/UX Design, System Architecture  
> Status: Functional Portfolio Prototype

---

## 01. Project Overview

스크린골프 시설의 구축 과정에서는 공간 크기와 구조, 장비별 설치 위치, 예산 등을 함께 고려해야 합니다.

기존의 장비 목록과 공간 설계 작업을 하나의 사용자 흐름으로 통합하고, 별도의 전문 CAD 프로그램 없이 웹 브라우저에서 장비 배치를 검토할 수 있는 환경을 구현하는 것을 목표로 하였습니다.

**Key Objectives**

- 장비 카탈로그와 공간 설계 기능의 통합
- Drag & Drop 기반의 직관적인 장비 배치
- 장비 위치·크기·회전 정보의 구조화된 관리
- 공간 템플릿을 활용한 설계 작업 간소화
- 설계 데이터 저장 및 외부 활용 지원

---

## 02. Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js |
| Frontend | React, TypeScript |
| Styling | Tailwind CSS |
| Canvas Engine | Konva.js |
| Data Persistence | Browser localStorage |
| Data Export | JSON, PNG |
| Version Control | Git, GitHub |

브라우저 기반의 인터랙티브 설계 환경을 중심으로 구현하였으며, 현재 버전은 별도의 서버 데이터베이스 없이 클라이언트 측 저장 기능을 활용합니다.

---

## 03. Core Features

### 01. Equipment Catalog & Product Management

**장비 카탈로그 및 제품 관리**

- 6개 장비 카테고리별 제품 목록 제공
- 카테고리 필터 및 키워드 검색
- 제품 이미지, 이름, 가격 정보 표시
- 사용자 제품 이미지 업로드 및 변경
- 카탈로그에서 설계 에디터로 장비 추가

### 02. Interactive 2D Design Studio

**인터랙티브 2D 공간 설계**

- Konva.js 기반 2D 캔버스 구현
- Drag & Drop 방식의 장비 배치
- 장비 위치 이동, 크기 조절 및 회전
- 선택한 장비의 속성 패널 제공
- 장비 복제 및 삭제
- 캔버스 확대·축소 및 편집 이력 관리

### 03. Room Templates & Background Customization

**공간 템플릿 및 배경 설정**

- Classic Planning
- Premium Private Bay
- Commercial Golf Bay
- 사용자 공간 이미지 업로드
- 공간 유형에 따른 설계 환경 변경

### 04. Layout Data Management

**설계 데이터 및 편집 이력 관리**

- 브라우저 기반 설계 정보 자동 저장
- 저장된 설계 상태 복원
- Undo / Redo 지원
- 설계 결과 PNG 이미지 내보내기
- 장비 배치 정보 JSON 파일 내보내기

JSON 데이터에는 장비 식별자, 제품 ID, X/Y 좌표, 너비, 높이 및 회전 정보 등이 포함됩니다.

### 05. Project Dashboard & Render Studio

**프로젝트 관리 및 설계 정보 시각화**

- 프로젝트별 설계 정보 확인
- 선택한 공간 템플릿 및 장비 수 표시
- 배치된 장비 목록 확인
- 장비 가격 기반 예상 비용 산출
- 향후 AI 렌더링 기능 연동을 위한 별도 화면 구성

**Note:** Render Studio는 현재 설계 정보 확인과 AI 렌더링 연동 준비를 위한 인터페이스입니다. 실제 AI 이미지 생성 기능은 연결되지 않았습니다.

---

## 04. Technical Implementation

### Canvas-Based Equipment Editing

Konva.js를 활용하여 장비 객체를 캔버스에 렌더링하고, 사용자 입력에 따라 위치·크기·회전 속성을 변경할 수 있도록 구현하였습니다.

선택된 객체의 속성값을 별도의 패널에서 확인하고 수정할 수 있도록 구성하여 시각적 편집과 수치 기반 편집을 함께 지원합니다.

### Structured Layout Data

설계 데이터를 장비 객체 단위로 관리하여 캔버스 화면과 데이터 구조를 연결하였습니다.

각 장비는 고유 식별자와 제품 ID, 위치, 크기 및 회전 속성을 가지며 JSON 형태로 내보낼 수 있습니다.

### Browser-Based Persistence

브라우저 localStorage를 활용하여 작업 중인 설계 상태를 저장하고 복원하도록 구현하였습니다.

별도 서버 구축 없이 설계 편집 흐름을 검증할 수 있도록 구성한 프로토타입 아키텍처입니다.

### Integrated Product-to-Design Workflow

제품 카탈로그에서 선택한 장비를 설계 공간에 추가하고, 배치된 장비의 정보를 프로젝트 요약 및 예상 비용 계산에 활용하도록 기능을 연결하였습니다.

---

## 05. Application Workflow

1. **Explore Equipment** — 장비 카탈로그 탐색 및 제품 선택
2. **Open Design Studio** — 설계 스튜디오 실행
3. **Select Room Template** — 공간 템플릿 또는 사용자 배경 선택
4. **Arrange Equipment** — 장비 배치 및 속성 편집
5. **Review Project** — 장비 구성과 예상 비용 확인
6. **Save & Export** — 설계 저장 및 PNG·JSON 내보내기

---

## 06. Getting Started

**Requirements**

- Node.js
- npm

**Installation**

```bash
git clone https://github.com/sianobuilds/golfspace-studio.git
cd golfspace-studio
npm install
```

**Development Server**

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 07. Current Scope & Limitations

본 프로젝트는 스크린골프 시설 설계 업무를 웹 환경에서 시연하기 위한 기능형 프로토타입입니다.

- 제품 카탈로그는 데모 데이터 기반으로 구성
- 설계 데이터는 브라우저 로컬 환경에 저장
- 실제 장비 설치 가능 여부나 시공 적합성을 검증하는 CAD·BIM 시스템은 아님
- 예상 장비 비용은 등록된 제품 가격을 기반으로 계산
- AI 렌더링 기능은 미연동 상태

---

## 08. Future Improvements

- AI 기반 공간 이미지 렌더링 연동
- 사용자 인증 및 클라우드 프로젝트 저장
- 실제 장비 데이터베이스 및 공급업체 연동
- 공간 치수 및 장비 간 간섭 검증
- 설계안 공유 및 협업 기능
- 견적서 자동 생성 기능

---

## 09. Repository

**GitHub:** https://github.com/sianobuilds/golfspace-studio

This repository contains a portfolio-oriented prototype demonstrating interactive 2D equipment planning, product catalog integration, and structured layout data management.

---

**GolfSpace Studio — Plan Smarter. Design Better.**
