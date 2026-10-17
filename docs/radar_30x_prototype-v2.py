import json
import math
import re

class ContentRadar30X:
    """
    Prototipo v2 para el Reto 30X: Radar de Contenido.
    Modelado de datos enriquecido que evalúa:
    1. Aceleración y Velocidad (Burst Score - Algoritmo de Kleinberg adaptado).
    2. Fit de Personas/Audiencia Objetivo (Founders, CEOs, CTOs, Inversionistas).
    3. Fit de Tipo de Empresa (Startups B2B, SaaS, FinTech, PyMEs LatAm).
    4. Fit con Pilares de Contenido Ideal para 30X (ROI con IA, Máquinas de Ventas, Revenue per Employee, Liderazgo Contrarian).
    5. Explicabilidad ("Por qué funcionó") y Plan de Adaptación Prescriptivo para Andrés Bilbao / @crece30x.
    """
    def __init__(self):
        # 1. Personas Objetivo de 30X
        self.target_personas = {
            "Founders & CEOs": ["founder", "ceo", "cofundador", "cofundadora", "director general", "emprendedor", "startups"],
            "CTOs & Líderes Tech": ["cto", "director de tecnologia", "vp of engineering", "lider de operaciones", "desarrollador", "arquitecto ia"],
            "Inversionistas & Mentores": ["inversionista", "angel", "venture capital", "fundraising", "socio"]
        }
        
        # 2. Tipos de Empresa Objetivo
        self.target_companies = {
            "Startups B2B & SaaS": ["b2b", "saas", "fintech", "logistica", "ecommerce", "tech startup", "series a", "seed"],
            "PyMEs Tradicionales en Transformación": ["pyme", "empresa tradicional", "transformacion digital", "consultoria", "eficiencia operativa"]
        }
        
        # 3. Pilares de Contenido Ideal para 30X
        self.content_pillars = {
            "ROI & Costos de IA": [
                "deepseek", "llama", "costos de inferencia", "open source", "gpt-4o", "roi",
                "presupuesto ia", "modelos abiertos", "ahorro de costos", "eficiencia ia"
            ],
            "Máquinas de Ventas & Automatización B2B": [
                "dapta", "make", "python", "prospeccion", "pipeline", "embudo de ventas",
                "agentes ia", "agentes de ventas", "crm", "workflow", "automatizacion comercial"
            ],
            "Eficiencia & Revenue per Employee": [
                "revenue per employee", "facturacion por empleado", "equipo magro", "lean team",
                "segundo cerebro", "productividad empresarial", "escalabilidad sin nomina"
            ],
            "Liderazgo & Cultura Contrarian": [
                "andres bilbao", "maquina de ventas", "ejecucion", "cultura de trabajo",
                "contrarian", "sin filtro", "contra la ia generica", "unidades economicas"
            ]
        }

    def calculate_burst_score(self, views, likes, comments, hours_since_published):
        """
        Calcula la velocidad y aceleración de interacción (Burst Score)
        basado en la tasa de engagement por hora (Inspirado en el algoritmo de Kleinberg).
        """
        if hours_since_published <= 0:
            hours_since_published = 0.5
            
        total_engagement = (likes * 1.5) + (comments * 3.0) + (views * 0.05)
        velocity = total_engagement / hours_since_published
        
        burst_score = min(100.0, math.log1p(velocity) * 12.5)
        return round(burst_score, 2)

    def evaluate_persona_fit(self, text):
        """Evalúa la alineación con las personas objetivo de 30X."""
        text_lower = text.lower()
        matched_personas = []
        score_accum = 0
        
        for persona, keywords in self.target_personas.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                matched_personas.append(persona)
                score_accum += matches * 25
                
        fit_score = min(100.0, score_accum if score_accum > 0 else 15.0)
        return round(fit_score, 1), matched_personas or ["Audiencia General Tech"]

    def evaluate_company_fit(self, text):
        """Evalúa la alineación con los tipos de empresa objetivo."""
        text_lower = text.lower()
        matched_company_types = []
        score_accum = 0
        
        for company_type, keywords in self.target_companies.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                matched_company_types.append(company_type)
                score_accum += matches * 30
                
        fit_score = min(100.0, score_accum if score_accum > 0 else 20.0)
        return round(fit_score, 1), matched_company_types or ["General B2B/Tech"]

    def evaluate_content_pillar_fit(self, text):
        """Evalúa qué tan bien encaja el tema con los pilares de contenido de 30X."""
        text_lower = text.lower()
        pillar_matches = {}
        
        for pillar, keywords in self.content_pillars.items():
            matches = [kw for kw in keywords if kw in text_lower]
            if matches:
                pillar_matches[pillar] = matches
                
        if pillar_matches:
            dominant_pillar = max(pillar_matches.items(), key=lambda x: len(x[1]))[0]
            total_kw_hits = sum(len(hits) for hits in pillar_matches.values())
            score = min(100.0, total_kw_hits * 25 + 30)
        else:
            dominant_pillar = "Contenido Genérico / Fuera de Pilar 30X"
            score = 15.0
            
        return round(score, 1), dominant_pillar, pillar_matches

    def analyze_why_it_worked(self, title, description, dominant_pillar, matched_personas):
        """Descompone las causas del rendimiento (Gancho, Formato y Drivers Clave)."""
        words = len(title.split())
        has_numbers = bool(re.search(r'\d+', title))
        
        hook_type = "Comparativa Económica / Dato Contundente" if has_numbers else "Caso de Estudio Práctico / Provocación"
        format_type = "MOFU (Atención Central - Carrusel / Video Explicativo)" if words > 8 else "TOFU (Atención Periférica - Reel / Post Corto)"
        
        personas_str = ", ".join(matched_personas)
        key_drivers = [
            f"Ataca directamente un pilar clave de 30X: {dominant_pillar}",
            f"Alineado con el perfil de decisión de: {personas_str}",
            "Formato denso que genera racionalización de compra y aprendizaje B2B"
        ]
        
        return {
            "hook_type": hook_type,
            "format_type": format_type,
            "key_drivers": key_drivers
        }

    def generate_30x_adaptation(self, title, burst_score, persona_score, company_score, pillar_score, dominant_pillar, matched_personas):
        """Genera el plan de acción prescriptivo adaptado para Andrés Bilbao o @crece30x."""
        # Ponderación estratégica: 30% Aceleración, 25% Persona, 20% Empresa, 25% Pilar
        overall_30x_score = round(
            (burst_score * 0.30) + 
            (persona_score * 0.25) + 
            (company_score * 0.20) + 
            (pillar_score * 0.25), 
            1
        )
        
        if overall_30x_score >= 75:
            urgency = "ALTA (Ventana de oportunidad: 24-48 horas)"
            action = "PRODUCIR REEL / POST PRINCIPAL PARA LINKEDIN Y YOUTUBE"
            speaker = "Andrés Bilbao (Enfoque Founder/CEO & Estrategia)" if "Founders & CEOs" in matched_personas else "@crece30x (Enfoque Equipo & Implementación)"
        elif overall_30x_score >= 50:
            urgency = "MEDIA (Ventana: 3-5 días)"
            action = "INCLUIR EN BOLETÍN / CARRUSEL SEMANAL"
            speaker = "@crece30x (Canal educativo)"
        else:
            urgency = "BAJA"
            action = "DESCARTAR O MANTENER EN OBSERVACIÓN"
            speaker = "N/A"

        return {
            "overall_30x_score": overall_30x_score,
            "urgency": urgency,
            "recommended_action": action,
            "recommended_speaker": speaker,
            "proposed_angle": f"Cómo aplicar '{title}' en la estrategia de tu empresa en LatAm ({dominant_pillar})",
            "script_outline": [
                f"1. Hook (3s): 'Si eres {matched_personas[0] if matched_personas else 'líder de equipo'} y estás buscando escala real con IA...'",
                f"2. Desglose Causal: Por qué '{title}' cambia las reglas del juego para {dominant_pillar}.",
                "3. Caso de Uso 30X: Demostración práctica de cómo lo aplicamos en nuestras startups/equipos en LatAm.",
                "4. CTA: Comenta '30X' o entra al link en bio para ver la plantilla de implementación."
            ]
        }

    def process_content_piece(self, piece_data):
        """Ejecuta el pipeline completo sobre una pieza de contenido pública."""
        text_full = piece_data["title"] + " " + piece_data["description"]
        
        burst_score = self.calculate_burst_score(
            piece_data["views"], 
            piece_data["likes"], 
            piece_data["comments"], 
            piece_data["hours_ago"]
        )
        
        persona_score, matched_personas = self.evaluate_persona_fit(text_full)
        company_score, matched_companies = self.evaluate_company_fit(text_full)
        pillar_score, dominant_pillar, pillar_matches = self.evaluate_content_pillar_fit(text_full)
        
        why_worked = self.analyze_why_it_worked(piece_data["title"], piece_data["description"], dominant_pillar, matched_personas)
        adaptation = self.generate_30x_adaptation(
            piece_data["title"], burst_score, persona_score, company_score, pillar_score, dominant_pillar, matched_personas
        )
        
        return {
            "id": piece_data["id"],
            "title": piece_data["title"],
            "platform": piece_data["platform"],
            "author": piece_data["author"],
            "metrics": {
                "views": piece_data["views"],
                "likes": piece_data["likes"],
                "comments": piece_data["comments"],
                "hours_ago": piece_data["hours_ago"]
            },
            "evaluations": {
                "burst_velocity_score": burst_score,
                "persona_fit": {
                    "score": persona_score,
                    "matched_personas": matched_personas
                },
                "company_fit": {
                    "score": company_score,
                    "matched_companies": matched_companies
                },
                "content_pillar_fit": {
                    "score": pillar_score,
                    "dominant_pillar": dominant_pillar,
                    "matched_keywords": pillar_matches
                },
                "overall_30x_score": adaptation["overall_30x_score"]
            },
            "why_it_worked": why_worked,
            "adaptation_plan": adaptation
        }


# Dataset de prueba refinado con casos de uso reales
sample_data = [
    {
        "id": "post_001",
        "title": "DeepSeek v3 vs GPT-4o: Reducción del 90% en costos de inferencia para startups y empresas",
        "description": "Análisis técnico y financiero para founders, CEOs y CTOs en Latinoamérica sobre cómo los modelos de código abierto optimizan el presupuesto de IA y el ROI empresarial.",
        "platform": "LinkedIn",
        "author": "AI Industry Insights",
        "views": 45000,
        "likes": 1800,
        "comments": 320,
        "hours_ago": 6
    },
    {
        "id": "post_002",
        "title": "Cómo construir una Máquina de Ventas B2B automatizada con Dapta y Make en 24 horas",
        "description": "Guía práctica para cofundadores y líderes de ventas en empresas SaaS y B2B para calificar leads y aumentar el revenue per employee sin aumentar la nómina.",
        "platform": "YouTube",
        "author": "Growth Hacker LatAm",
        "views": 28000,
        "likes": 1400,
        "comments": 190,
        "hours_ago": 12
    },
    {
        "id": "post_003",
        "title": "10 Prompts genéricos de ChatGPT para ser más feliz en la oficina",
        "description": "Consejos breves de motivación personal para trabajo remoto.",
        "platform": "Instagram",
        "author": "Lifestyle Tech",
        "views": 15000,
        "likes": 300,
        "comments": 10,
        "hours_ago": 48
    }
]

if __name__ == "__main__":
    radar = ContentRadar30X()
    results = [radar.process_content_piece(item) for item in sample_data]
    print(json.dumps(results, indent=2, ensure_ascii=False))
