import heroImage from "@assets/generated_images/Modern_office_building_hero_719d89ba.png";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden rounded-lg mx-4 sm:mx-6 lg:mx-8 mt-6">
      {/* Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}