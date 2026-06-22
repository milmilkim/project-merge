export interface Film {
  /** 포스터 이미지. 아직 준비되지 않은 회차는 비워둔다(플레이스홀더 표시). */
  poster?: string;
  title: string;
  description: string;
}
