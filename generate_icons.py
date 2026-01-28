from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Crear imagen con fondo gradiente
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Crear gradiente de fondo
    for y in range(size):
        color_value = int(99 + (118 - 99) * (y / size))  # Gradiente morado
        color = (color_value, 102, 241)  # RGB del color primario
        draw.line([(0, y), (size, y)], fill=color)
    
    # Dibujar un círculo blanco en el centro
    margin = size // 6
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill='white', outline=None)
    
    # Dibujar un símbolo de check (✓)
    check_size = size // 2
    check_x = size // 2
    check_y = size // 2
    
    # Líneas del check
    line_width = size // 20
    draw.line([(check_x - check_size//4, check_y), 
               (check_x - check_size//8, check_y + check_size//4)], 
              fill=(99, 102, 241), width=line_width)
    draw.line([(check_x - check_size//8, check_y + check_size//4), 
               (check_x + check_size//3, check_y - check_size//4)], 
              fill=(99, 102, 241), width=line_width)
    
    # Guardar imagen
    img.save(filename, 'PNG')
    print(f'Icono creado: {filename}')

# Crear los iconos
create_icon(192, '/home/claude/icons/icon-192x192.png')
create_icon(512, '/home/claude/icons/icon-512x512.png')

print('¡Todos los iconos han sido generados!')
