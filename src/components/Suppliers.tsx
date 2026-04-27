import { motion } from "framer-motion";
import { usePublicSuppliers } from "@/hooks/usePublicData";

const Suppliers = () => {
    const { suppliers: supplierBrands } = usePublicSuppliers();

    return (
        <section id="fornecedores" className="py-24 bg-gradient-to-b from-white to-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold text-sm tracking-widest uppercase">
                        Fornecedores
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                        Parceiros de Qualidade
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Trabalhamos com os melhores fabricantes do mercado para oferecer sempre a melhor solucao.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto"
                >
                    {supplierBrands.map((brand, index) => (
                        <motion.a
                            key={brand.name}
                            href={brand.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="group flex items-center justify-center aspect-[4/3] bg-white rounded-2xl border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden p-6"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
                            />
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Suppliers;
