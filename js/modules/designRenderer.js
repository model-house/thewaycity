// Design Section Renderer Module
export class DesignRenderer {
    render(data) {
        if (!data || data.visible === false) return '';
        
        // 첫 번째 카드를 기본 활성화
        const activeIndex = 0;
        
        return `
            <section id="design" class="section design-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${data.title || '단지 설계'}</h2>
                    </div>
                    <div class="design-content">
                        <div class="design-info">
                            ${data.cards.map((card, index) => `
                                <div class="design-item ${index === activeIndex ? 'active' : ''}" data-index="${index}">
                                    <h3 class="design-title">${card.title}</h3>
                                    <div class="design-details">
                                        ${card.points && card.points.length > 0 ? 
                                            card.points.map(point => `
                                                <div class="design-point">
                                                    <strong class="point-label">${point.label}</strong>
                                                    <span class="point-description">${point.description}</span>
                                                </div>
                                            `).join('') : 
                                            card.description ? `<div class="design-description">${card.description}</div>` : ''
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="design-slider-wrapper">
                            <div class="design-image-container">
                                <div class="design-slider">
                                    <div class="design-slides">
                                        ${data.cards.map((card, index) => `
                                            <div class="design-slide ${index === activeIndex ? 'active' : ''}" data-slide="${index}">
                                                <img src="${card.image}" alt="${card.title}" loading="lazy">
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
