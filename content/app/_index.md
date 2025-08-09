---
title: ""
layout: page
searchHidden: true
---

{{< apps >}}

<style>
    .tools-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }
    
    .tools-header {
        text-align: center;
        margin-bottom: 2.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
    }
    
    .tools-title {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--primary);
    }
    
    .tools-subtitle {
        color: var(--secondary);
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .tool-card {
        background: var(--card-bg);
        border-radius: 8px;
        border: 1px solid var(--border);
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .tool-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .tool-header {
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--border);
        background-color: var(--card-header-bg);
    }
    
    .tool-title {
        margin: 0;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .tool-icon {
        font-size: 2rem;
        color: var(--primary);
    }
    
    .tool-body {
        padding: 1rem;
    }
    
    .tool-description {
        color: var(--secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
        font-size: 0.95rem;
    }
    
    .tool-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    
    .tool-link:hover {
        color: var(--primary-hover);
        text-decoration: underline;
    }
    
    .tool-link-arrow {
        font-size: 0.9rem;
        transition: transform 0.2s;
    }
    
    .tool-link:hover .tool-link-arrow {
        transform: translateX(2px);
    }
    
    .coming-soon {
        position: relative;
        opacity: 0.8;
    }
    
    .coming-soon::after {
        content: "即将推出";
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: var(--code-bg);
        color: var(--secondary);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        border: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
        .tools-grid {
            grid-template-columns: 1fr;
        }
        
        .tools-title {
            font-size: 1.75rem;
        }
    }
</style>

