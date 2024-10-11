# **VERCEL BATCH**

![preview-main](/preview-main.gif)
![preview-history](./preview-history.gif)

## 소개
[Go Demo Site](https://batch-ruddy.vercel.app/)
[Vercel](https://vercel.com/docs)와 [Next.js](https://nextjs.org/)를 기반으로 한 배치 작업 관리 애플리케이션입니다. `이메일 분류`, `GPT를 활용한 유튜브 콘텐츠 생성` 등 다양한 Job을 생성하고, [Vercel Cron](https://vercel.com/docs/cron-jobs)을 이용해 주기적으로 실행할 수 있습니다.

## **주요 기능**

**• 주기적 실행: Vercel Cron을 활용해 Job을 자동으로 실행합니다.**

**• 실시간 실행: 웹에서 직접 Job을 실행할 수 있습니다.**

**• 히스토리 및 로그 확인: 실행 결과와 로그를 확인하여 작업 상태를 모니터링합니다.**

## ⚠️

> Vercel은 **서버리스** 플랫폼으로 **실행 시간과 메모리 사용량** 등 제한이 있습니다.
> 그럼에도 **무료로 배포**하여 간단한 업무 자동화를 목표로 하고 있습니다.

## **설치 방법**

**1. 레포지토리 클론 및 로컬 initial**

```bash
git clone https://github.com/cgoinglove/vercel-batch.git

cd vercel-batch

# npm yarn
pnpm install

pnpm dev
```

**2. Job 코드 작성**

```typescript
// src/tasks/your-job.ts

export const MyJob = Job.builder()
                        .name('Sample Job')
                        .description('-')
                        .step('step 1',()=>{
                            // ...
                        })
                        .step('step 2',()=>{
                            // ...
                        })
                        .build()


// src/app/actions/job.action.ts

const jobs = [
  MyJob,
  ...
]
```

**3. Vercel Cron**

```json
// root/vercel.json
{
  "crons": [
    {
      "path": "/api/cron/${JobName}",
      "schedule": "${cron}" // 0 0 * * *
    }
  ]
}
```

**4. Vercel Deploy**

> [Vercel](https://vercel.com/docs)의 가이드에 따라 배포

**🛠️ 그외 작성해야하는 것들**

- HistoryService
  - 작업상태를 저장하기 위해 서비스를 작성해야합니다.
  - vercel 의 kv,postgres 또한 무료플랜도 사용 할수있습니다.
- Authentication
  - next action, vercel cron REST(GET) 에 대한 권한을 구현 해야합니다.
