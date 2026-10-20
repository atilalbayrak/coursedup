COURSEDUP LEGAL DOCX AUTO-PUBLISH — v16

UPLOAD
Place versioned Word files in the same public web directory as terms.html, privacy.html and cookie.html.

Accepted names:
- coursedup_terms_of_use_v001.docx
- coursedup_privacy_policy_v001.docx
- coursedup_cookie_policy_v001.docx

For a new version, increment only the numeric suffix, for example:
- coursedup_terms_of_use_v002.docx

The highest numeric version is published automatically. Older DOCX files remain untouched as the archive.

SERVER REQUIREMENTS
- PHP 8.0 or newer
- PHP extensions: zip, dom/libxml

Plesk PHP packages normally provide these common modules; confirm that they are enabled for the PHP handler used by coursedup.com.

HOW IT WORKS
- terms.html / privacy.html / cookie.html keep the existing page shell and design.
- legal.js requests legal-content.php.
- legal-content.php finds the highest matching version number, reads the DOCX, converts supported Word structure to safe HTML and returns it.
- Converted HTML is cached in legal-cache/ when the web process has write permission. If cache creation is not possible, publishing still works and the DOCX is converted on request.
- After a successful publish, the current rendered version is stored as the last-known-good copy. If a newer DOCX is corrupt or incomplete during FTP upload, the site continues to show the last successful legal version and logs the conversion error. If no successful version exists yet, an error is shown.

SUPPORTED WORD FORMATTING
- Title is omitted because the page already has its own title.
- Heading 1/2/3
- Existing Terms-style bold numbered section headings
- Paragraphs
- Bold, italic, underline
- Word hyperlinks and safe plain web addresses
- Bulleted and numbered lists

NOT IMPORTED
- Word fonts, font sizes, colors, page margins, headers/footers and visual page layout.
The CoursedUp CSS remains responsible for presentation.
