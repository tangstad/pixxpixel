describe("Pixx", function() {
  it("should not hit things outside", function() {
    var pixx = new Pixx(0, 0);
    expect(pixx.size).toBe(4);
    var left = { x: -4, y: 0, size: 4 };
    var right = { x: 4, y: 0, size: 4 };
    var up = { x: 0, y: -4, size: 4 };
    var down = { x: 0, y: 4, size: 4 };

    expect(pixx.isHit(left)).toBeFalsy();
    expect(pixx.isHit(right)).toBeFalsy();
    expect(pixx.isHit(up)).toBeFalsy();
    expect(pixx.isHit(down)).toBeFalsy();
  });

  it("should hit things on sides", function() {
    var pixx = new Pixx(0, 0);
    var left = { x: -3, y: 0, size: 4 };
    var right = { x: 3, y: 0, size: 4 };
    var up = { x: 0, y: -3, size: 4 };
    var down = { x: 0, y: 3, size: 4 };

    expect(pixx.isHit(left)).toBeTruthy();
    expect(pixx.isHit(right)).toBeTruthy();
    expect(pixx.isHit(up)).toBeTruthy();
    expect(pixx.isHit(down)).toBeTruthy();

  });

  it("shouldn't hit big things outside", function() {
    var pixx = new Pixx(0, 0);
    var left = { x: -10, y: 0, size: 10 };
    var right = { x: 4, y: 0, size: 10 };
    var up = { x: 0, y: -4, size: 10 };
    var down = { x: 0, y: 10, size: 10 };

    expect(pixx.isHit(left)).toBeFalsy();
    expect(pixx.isHit(right)).toBeFalsy();
    expect(pixx.isHit(up)).toBeFalsy();
    expect(pixx.isHit(down)).toBeFalsy();
  });

  it("should hit big things on sides", function() {
    var pixx = new Pixx(0, 0);
    var left = { x: -9, y: 0, size: 10 };
    var right = { x: 3, y: 0, size: 10 };
    var up = { x: 0, y: -3, size: 10 };
    var down = { x: 0, y: 3, size: 10 };

    expect(pixx.isHit(left)).toBeTruthy();
    expect(pixx.isHit(right)).toBeTruthy();
    expect(pixx.isHit(up)).toBeTruthy();
    expect(pixx.isHit(down)).toBeTruthy();
  });
});
