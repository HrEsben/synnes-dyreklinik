-- Create FAQ table
CREATE TABLE IF NOT EXISTS public.faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on display_order for efficient ordering
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON public.faqs(display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON public.faqs(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.faqs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow read access for anonymous users (for public FAQ display)
CREATE POLICY "Allow read access for everyone" ON public.faqs
    FOR SELECT USING (is_active = true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default FAQ data
INSERT INTO public.faqs (question, answer, display_order) VALUES
('Hvordan booker jeg en tid?', 'Du kan ringe til mig på telefon 49 40 05 99 eller sende en email til info@synnesdyreklinik.dk. Jeg vender tilbage hurtigst muligt med ledige tider.', 1),
('Hvilke typer behandlinger tilbydes?', 'Jeg tilbyder medicinske udredninger, kirurgiske indgreb, tandbehandlinger og konsultationer for de fleste typer kæledyr.', 2),
('Hvad koster det – er der en prisliste?', 'Priserne varierer efter behandlingstype. Jeg giver altid et estimat før behandlingen påbegyndes, så der ikke er nogle overraskelser.', 3),
('Kommer du på hjemmebesøg?', 'Ja, i nogle tilfælde giver det mening at komme på hjemmebesøg. Og afhængigt af behandlingen eller andre udfordringer kommer jeg gerne på hjemmebesøg. Ring og hør om det giver mening, at jeg kommer forbi hjemme hos dig.', 4);
