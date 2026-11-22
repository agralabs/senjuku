// Canonical Minna no Nihongo I Book Mapping (Synced with Reference Google Sheet)
// Maps Lesson 1–25 titles (Japanese & Indonesian), audio track ranges, Conversation (会話), and Exercises (問題).

export const BOOK_LESSON_MAP = {
  1:  { lesson: 1,  titleJa: 'はじめまして', titleId: 'Perkenalkan', tracks: '001–004', trackCount: 4, conversation: '001', exercise1: '002', otherExercises: '003 (2番), 004 (3番)' },
  2:  { lesson: 2,  titleJa: 'これからお世話になります', titleId: 'Mulai sekarang saya mohon bantuannya', tracks: '005–008', trackCount: 4, conversation: '005', exercise1: '006', otherExercises: '007 (2番), 008 (3番)' },
  3:  { lesson: 3,  titleJa: 'これをください', titleId: 'Tolong berikan saya yang ini', tracks: '009–011', trackCount: 3, conversation: '009', exercise1: '010', otherExercises: '011 (2番)' },
  4:  { lesson: 4,  titleJa: 'そちらは何時までですか', titleId: 'Di sana buka sampai jam berapa?', tracks: '012–016', trackCount: 5, conversation: '012', exercise1: '013', otherExercises: '014 (2番), 015 (3番), 016 (4番)' },
  5:  { lesson: 5,  titleJa: 'この電車は甲子園へ行きますか', titleId: 'Apakah kereta ini pergi ke Koshien?', tracks: '017–020', trackCount: 4, conversation: '017', exercise1: '018', otherExercises: '019 (2番), 020 (3番)' },
  6:  { lesson: 6,  titleJa: '一緒に行きませんか', titleId: 'Maukah pergi bersama-sama?', tracks: '021–023', trackCount: 3, conversation: '021', exercise1: '022', otherExercises: '023 (2番)' },
  7:  { lesson: 7,  titleJa: 'いらっしゃい', titleId: 'Selamat datang', tracks: '024–027', trackCount: 4, conversation: '024', exercise1: '025', otherExercises: '026 (2番), 027 (3番)' },
  8:  { lesson: 8,  titleJa: 'そろそろ失礼します', titleId: 'Sudah waktunya saya permisi pulang', tracks: '028–031', trackCount: 4, conversation: '028', exercise1: '029', otherExercises: '030 (2番), 031 (3番)' },
  9:  { lesson: 9,  titleJa: '残念ですが', titleId: 'Sayang sekali, tapi...', tracks: '032–034', trackCount: 3, conversation: '032', exercise1: '033', otherExercises: '034 (2番)' },
  10: { lesson: 10, titleJa: 'ナンプラーありますか', titleId: 'Apakah ada kecap ikan (nam pla)?', tracks: '035–038', trackCount: 4, conversation: '035', exercise1: '036', otherExercises: '037 (2番), 038 (3番)' },
  11: { lesson: 11, titleJa: 'これ、お願いします', titleId: 'Tolong kirim yang ini', tracks: '039–042', trackCount: 4, conversation: '039', exercise1: '040', otherExercises: '041 (2番), 042 (3番)' },
  12: { lesson: 12, titleJa: '祇園祭はどうでしたか', titleId: 'Bagaimana Festival Gion?', tracks: '043–045', trackCount: 3, conversation: '043', exercise1: '044', otherExercises: '045 (2番)' },
  13: { lesson: 13, titleJa: '別々にお願いします', titleId: 'Tolong bayarnya dipisah', tracks: '046–048', trackCount: 3, conversation: '046', exercise1: '047', otherExercises: '048 (2番)' },
  14: { lesson: 14, titleJa: 'みどり町までお願いします', titleId: 'Tolong antar sampai Midori-cho', tracks: '049–052', trackCount: 4, conversation: '049', exercise1: '050', otherExercises: '051 (2番), 052 (3番)' },
  15: { lesson: 15, titleJa: 'ご家族は', titleId: 'Bagaimana dengan keluarga Anda?', tracks: '053–055', trackCount: 3, conversation: '053', exercise1: '054', otherExercises: '055 (2番)' },
  16: { lesson: 16, titleJa: '使い方を教えてください', titleId: 'Tolong ajari saya cara menggunakannya', tracks: '056–059', trackCount: 4, conversation: '056', exercise1: '057', otherExercises: '058 (2番), 059 (3番)' },
  17: { lesson: 17, titleJa: 'どうしましたか', titleId: 'Ada keluhan apa (sakit apa)?', tracks: '060–062', trackCount: 3, conversation: '060', exercise1: '061', otherExercises: '062 (2番)' },
  18: { lesson: 18, titleJa: '趣味は何ですか', titleId: 'Apa hobi Anda?', tracks: '063–065', trackCount: 3, conversation: '063', exercise1: '064', otherExercises: '065 (2番)' },
  19: { lesson: 19, titleJa: 'ダイエットは明日からします', titleId: 'Dietnya mulai besok saja', tracks: '066–068', trackCount: 3, conversation: '066', exercise1: '067', otherExercises: '068 (2番)' },
  20: { lesson: 20, titleJa: '一緒に行かない？', titleId: 'Mau pergi bareng nggak?', tracks: '069–071', trackCount: 3, conversation: '069', exercise1: '070', otherExercises: '071 (2番)' },
  21: { lesson: 21, titleJa: '私もそう思います', titleId: 'Saya juga berpikir begitu', tracks: '072–074', trackCount: 3, conversation: '072', exercise1: '073', otherExercises: '074 (2番)' },
  22: { lesson: 22, titleJa: 'どんな部屋をお探しですか', titleId: 'Sedang mencari kamar yang seperti apa?', tracks: '075–077', trackCount: 3, conversation: '075', exercise1: '076', otherExercises: '077 (2番)' },
  23: { lesson: 23, titleJa: 'どうやって行きますか', titleId: 'Pergi naik apa (bagaimana caranya)?', tracks: '078–081', trackCount: 4, conversation: '078', exercise1: '079', otherExercises: '080 (2番), 081 (3番)' },
  24: { lesson: 24, titleJa: '手伝いに行きましょうか', titleId: 'Perlukah saya datang membantu?', tracks: '082–084', trackCount: 3, conversation: '082', exercise1: '083', otherExercises: '084 (2番)' },
  25: { lesson: 25, titleJa: '色々お世話になりました', titleId: 'Terima kasih banyak atas segala bantuannya', tracks: '085–087', trackCount: 3, conversation: '085', exercise1: '086', otherExercises: '087 (2番)' }
};

/**
 * Given a lesson number and track filename (e.g. 'minna_shokyu_1_001.mp3'),
 * returns the exact book section classification from the reference sheet.
 */
export function getSectionBookLabel(lessonId, trackFilename = '') {
  const meta = BOOK_LESSON_MAP[lessonId];
  const m = String(trackFilename).match(/(\d{3})/);
  const trackNum = m ? m[1] : null;
  if (!meta || !trackNum) return null;

  if (trackNum === meta.conversation) {
    return { trackNum, category: '会話 (Conversation)', badgeClass: 'book-cat-conv' };
  }
  if (trackNum === meta.exercise1) {
    return { trackNum, category: '問題 1番 (Exercise 1)', badgeClass: 'book-cat-ex1' };
  }

  // Match inside otherExercises e.g. "003 (2番), 004 (3番)"
  const re = new RegExp(`${trackNum}\\s*\\((\\d+)番\\)`);
  const exMatch = meta.otherExercises.match(re);
  if (exMatch) {
    const num = exMatch[1];
    return { trackNum, category: `問題 ${num}番 (Exercise ${num})`, badgeClass: 'book-cat-ex' };
  }

  return { trackNum, category: '問題 (Exercise)', badgeClass: 'book-cat-ex' };
}
