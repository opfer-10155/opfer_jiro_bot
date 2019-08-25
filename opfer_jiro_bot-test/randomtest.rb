random = Random.new

i=1
while (i>0)
    z = random.rand(1..260)
   T = false
   if z == 19
    T=true
   end
    puts("#{T}")
    if(T==true)
        puts("#{i}")
        break
    end
    
    i=i+1

end