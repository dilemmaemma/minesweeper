class Product
    attr_accessor :name, :price, :quantity
  
    def initialize(name, price, quantity)
      @name = name
      @price = price
      @quantity = quantity
    end
  end
  
  class Inventory
    attr_accessor :products
  
    def initialize
      @products = []
    end
  
    def add_product(product)
      @products << product
    end
  
    def list_products
      puts "Product List:"
      @products.each do |product|
        puts "#{product.name} - Price: $#{product.price} - Quantity: #{product.quantity}"
      end
    end
  
    def calculate_total_sales
      total_sales = @products.sum { |product| product.price * product.quantity }
      puts "Total Sales: $#{total_sales}"
    end
  end
  
  class ReportGenerator
    def generate_report(inventory)
      puts "Inventory Report:"
      inventory.list_products
      inventory.calculate_total_sales
    end
  end
  
  # Sample usage:
  inventory = Inventory.new
  
  product1 = Product.new("Laptop", 800, 10)
  product2 = Product.new("Phone", 400, 20)
  
  inventory.add_product(product1)
  inventory.add_product(product2)
  
  report_generator = ReportGenerator.new
  report_generator.generate_report(inventory)
  