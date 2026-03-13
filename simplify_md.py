"""
Prepares markdown for clean .docx export via pandoc.

Keeps: H1-H3, bold, italic, lists (- and 1.), tables, paragraphs.
Converts: H4+ → bold paragraph.
Removes: code fences (keeps content), inline backticks, horizontal rules.
"""

import re
from pathlib import Path


def simplify(text: str) -> str:
    lines = text.split('\n')
    out = []
    in_code = False

    for line in lines:
        stripped = line.strip()

        # Toggle code blocks — drop the fence, keep content
        if stripped.startswith('```'):
            in_code = not in_code
            if not in_code and out and out[-1] != '':
                out.append('')
            continue

        # Inside code block: keep as-is (pandoc will treat as plain paragraph)
        if in_code:
            # ASCII-art boxes → skip decorative lines of only box-drawing chars
            if stripped and all(c in '┌┐└┘├┤┬┴─│╔╗╚╝║═╠╣╦╩╬─┼ ' for c in stripped):
                continue
            # Preserve non-empty content lines from code blocks
            if stripped:
                out.append(line)
            else:
                if out and out[-1] != '':
                    out.append('')
            continue

        # Horizontal rules → blank line
        if re.match(r'^[\s]*[-─═]{3,}\s*$', stripped):
            if out and out[-1] != '':
                out.append('')
            continue

        # H4+ headings → bold paragraph
        m = re.match(r'^(#{4,})\s+(.*)', line)
        if m:
            title = m.group(2).strip()
            # Remove inline backticks from heading text
            title = re.sub(r'`([^`]*)`', r'\1', title)
            if out and out[-1] != '':
                out.append('')
            out.append(f'**{title}**')
            out.append('')
            continue

        # H1-H3 headings → keep
        m = re.match(r'^(#{1,3})\s+(.*)', line)
        if m:
            hashes = m.group(1)
            title = m.group(2).strip()
            title = re.sub(r'`([^`]*)`', r'\1', title)
            if out and out[-1] != '':
                out.append('')
            out.append(f'{hashes} {title}')
            out.append('')
            continue

        # Table lines → keep as-is
        if stripped.startswith('|') and '|' in stripped[1:]:
            out.append(line)
            continue

        # List items (-, *, 1.) — keep, just strip inline backticks
        list_match = re.match(r'^(\s*)([-*]|\d+\.)\s', line)
        if list_match:
            cleaned = re.sub(r'`([^`]*)`', r'\1', line)
            out.append(cleaned)
            continue

        # Blank line
        if stripped == '':
            if out and out[-1] != '':
                out.append('')
            continue

        # Regular text — strip inline backticks
        cleaned = re.sub(r'`([^`]*)`', r'\1', line)
        out.append(cleaned)

    # Collapse runs of 3+ blank lines to 2
    result = []
    blanks = 0
    for line in out:
        if line == '':
            blanks += 1
            if blanks <= 2:
                result.append(line)
        else:
            blanks = 0
            result.append(line)

    return '\n'.join(result).strip() + '\n'


def main():
    docs_dir = Path('/Users/mak/trihologyback/docs')
    out_dir = Path('/Users/mak/trihologyback/docs_clean')
    out_dir.mkdir(exist_ok=True)

    for md_file in sorted(docs_dir.glob('*.md')):
        text = md_file.read_text(encoding='utf-8')
        result = simplify(text)
        out_path = out_dir / md_file.name
        out_path.write_text(result, encoding='utf-8')

        orig = len(text.split('\n'))
        new = len(result.split('\n'))
        print(f'{md_file.name}: {orig} → {new}')


if __name__ == '__main__':
    main()
