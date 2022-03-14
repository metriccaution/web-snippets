export const intro = `# Happy Pi Day 2022!

In celebration, I'm going to take a leaf out of
[Matt Parker's](https://standupmaths.com/) book, and calculate π in a somewhat
unusual way.

For the curious, prior art incluces
[calculating π with pies](https://www.youtube.com/watch?v=ZNiRzZ66YN0),
[rolling 1000 dice, in 2017](https://www.youtube.com/watch?v=RZBhSi_PwHU),
[calculating 100 digits of π, by hand, in 2022](https://www.youtube.com/watch?v=dtiLxLrzjOQ)
and
[my own effort, back in 2018](https://metriccaution.github.io/web-snippets/pi-day-2018/).

This year, the plan is to draw some circles, and then look at them to try to
work out π. This will require some light use of the browser's value of π to work
this out, but I'm just going to overlook that for now.

We're going to draw some circles, and then counting the pixels present.
`;

export const singleLine = `## Nested Circles

My first thought when I was mulling over ideas for this idea was working out if
you could work out π from counting the number of pixels that are coloured in for
a circle on a canvas.

The first attempt I had was working π out for a single line, the maths is pretty
straight forwards here (assuming a single-pixel wide line, the number of
coloured pixels is roughly equal to the length of the circumference, so
rearranging the equation for this gives \`π = circumference / (2r)\`).
`;

export const singleLineReport = (pi: number) =>
  `This gives us a result for π of ${pi}, the best we can say for this is
that its at least the right order of magnitude.`;

export const nestedDescription = `## Nested Circles

Thinking about how to improve this, I wondered if making the line thicker would
make the approximation any better here.

The maths here is a _little_ more involved, we need to switch to calculating an
area, subtracting one circle from another.

This approximation ends up as
\`π = coloured area / (outer radius squared - inner radius squared)\`.
`;

export const nestedCirclesReport = (pi: number) =>
  `This gives us a result for π of ${pi}, which is a modest improvement.
Though at this point, I had a bit of a sinking feeling...`;

export const singleCircleDescription = `## Just a Circle

At this point, I had the thought that I was overcomplicating things - if
increasing the thickness of the circle makes the estimate more accurate, what
does a solid circle give us?
`;

export const singleCircleReport = (pi: number) =>
  `And this gives us a result of ${pi}.`;

export const conclusion = `## In Conclusion

So, the conclusion I've came to here has been that the more pixels are coloured
in, the better the approximation of π is.

While I haven't sat down and worked through any of the maths around why this is,
it makes intuitive sense - the error between the estimate, and the true value of
π is introduced by the differences in the discrete pixels, versus a continuous
true circle.
`;
