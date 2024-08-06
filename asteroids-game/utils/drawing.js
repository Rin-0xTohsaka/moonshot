export function drawPath(ctx, position, direction, scale, path, color = '#fff') {
    console.log('drawPath called with:', { position, direction, scale, pathLength: path.length, color });
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.translate(position[0], position[1]);
    ctx.rotate(direction);
    ctx.scale(scale, scale);
    
    ctx.beginPath();
    console.log('Beginning path');
    ctx.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1]);
        console.log(`Line to: ${path[i][0]}, ${path[i][1]}`);
    }
    ctx.stroke();
    console.log('Path stroked');
    
    ctx.restore();
    console.log('drawPath complete');
}