import test from 'node:test';
import assert from 'node:assert/strict';
import { formatFeedbackForHtml } from '../src/services/email.js';

test('feedback HTML encodes user-supplied markup and preserves line breaks', () => {
  const html = formatFeedbackForHtml({
    feedback: '<img src=x onerror="alert(\'x\')">&\nSecond line',
    name: '<script>alert(1)</script>',
    gender: 'Other',
    district: 'District',
    municipality: 'Municipality',
    ward_no: '1',
    village: 'Village',
    wants_response: false,
    is_confidential: false,
    id: 'feedback-1',
    created_at: '2026-01-01T00:00:00.000Z',
  });

  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(&#039;x&#039;)&quot;&gt;&amp;<br>Second line'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes('<script>'));
});
