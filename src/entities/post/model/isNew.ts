/** 2주 이내 작성 글 = 새 글(N 표시). 이용자가 적어 24h는 거의 안 뜸. pending(null)도 방금 쓴 글이므로 새 글. */
export const NEW_POST_MS = 14 * 24 * 60 * 60 * 1000;
export const isNewPost = (createdAt: number | null, now = Date.now()) =>
  createdAt === null || now - createdAt < NEW_POST_MS;
