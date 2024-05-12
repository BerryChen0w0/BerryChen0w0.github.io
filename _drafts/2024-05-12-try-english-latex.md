---
layout: post
title: try english latex
date: 2024-05-12 21:29 +0800
math: true
---

The $\Latex$ doesn't work in Chinese post now. What if this article is written in English?

equation in line: I have $f(x) = x^2 + \log (\sin x) - \left(\frac{2}{3} x\right)$ the function.

equation between lines: Let's try \{equation\}

$$
\begin{equation}
    f(x) = \sqrt[3]{x}
\end{equation}
$$

matrix:

$$
    A = \left(
        \begin{matrix}
        [v_{one} & x_1 & x_2 & x_3 & x_4 & x_5 & w_1 & w_2 & w_3 & w_4 & w_5] \\
        0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
        0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
        0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
        0 & 0 & 1 & 0 & 0 & 0 & 0 & 1 & 0 & 1 & 0 \\
        \end{matrix}
    \right)
$$

aligned:

$$
    \begin{aligned}
        x_1 \cdot w_1 &= w_3 \\
        x_3 \cdot x_4 &= w_4 \\
        w_3 \cdot (w_2+x_2) &= x_5 \\
        (w_4 + (w_2+x_2)) \cdot 1 &= w_5
    \end{aligned}
$$

So, what happens?