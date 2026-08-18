import React from 'react';

type KutipanToken = {
    type: 'b' | 'i' | 'normal';
    children: (KutipanToken | string)[];
};

function parseKutipan(teks: string): KutipanToken {
    const tokens = teks.split(/\[(\/?b|\/?i)\]/g);

    const root: KutipanToken = { type: 'normal', children: [] };
    const stack: KutipanToken[] = [root];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === 'b' || token === 'i') {
            const node: KutipanToken = { type: token, children: [] };
            stack[stack.length - 1]!.children.push(node);
            stack.push(node);
        } else if (token === '/b' || token === '/i') {
            const expected = token === '/b' ? 'b' : 'i';
            const top = stack[stack.length - 1];
            if (top && top.type === expected) {
                stack.pop();
            }
        } else if (token !== '') {
            stack[stack.length - 1]!.children.push(token);
        }
    }

    return root;
}

export function renderKutipan(teks: string): React.ReactNode {
    const node = parseKutipan(teks);
    const render = (child: KutipanToken | string): React.ReactNode => {
        if (typeof child === 'string') {
            return child;
        }

        const content = child.children.map((c) => render(c));
        if (child.type === 'b') {
            return <strong>{content}</strong>;
        }
        if (child.type === 'i') {
            return <em>{content}</em>;
        }

        return content;
    };

    return <>{node.children.map((c) => render(c))}</>;
}